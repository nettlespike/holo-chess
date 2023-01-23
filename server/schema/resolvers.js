const { ApolloError } = require("apollo-server-express");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { query, application } = require("express");
const { Chess } = require("chess.js");

async function validateUserName(_, args, context) {
    const { username } = args;
    const { dbClient } = context;
    // username is invalid if length is out of scope
    if(username == "") throw new ApolloError('Username empty.', 'NO_USERNAME');
    if(username.length > 50) throw new ApolloError('Username Longer than 50, select a shorter username.', "LONG_USERNAME");
    // username is invalid if it's already in use
    if((await dbClient.query(`SELECT * FROM Users WHERE username = '${username}';`)).rows.length > 0) throw new ApolloError('Username taken.')
    // success
    return true;
}

function verifyAuth(context) {
    if(context.userId) return true;
    throw new ApolloError('Not authorized to view this data.', 'JWT_INVALID')
}

async function isInGame(userId, context) {
    const { dbClient } = context;
    return (await dbClient.query(`SELECT * FROM Games WHERE (black_user_id = ${userId} OR white_user_id = ${userId}) OR game_state = 'PLAYING';`)).rows.length > 0;
}

function constructUser(dbUser) {
    gqlUser = {...dbUser};
    gqlUser.isBoard = gqlUser.is_chess_board;
    delete gqlUser.is_chess_board;
    return gqlUser;
}

function mapDbtoGql(dbGqlMap, row) {
    gqlObject = {}
    for(dbKey in dbGqlMap) {
        if(dbKey in row){
            gqlObject[dbGqlMap[dbKey]] = row[dbKey];
        }
    }
    return gqlObject;
}

async function getActiveGameId(_, args, context) {
    verifyAuth(context);
    const { dbClient, userId } = context;
    // check if they are even in game
    if(!isInGame(userId, context)) throw new ApolloError('Not in game!', 'NO_ACTIVE_GAME');
    // find the id
    return (await dbClient.query(`SELECT id FROM Games WHERE (black_user_id = ${userId} OR white_user_id = ${userId}) AND game_state = 'PLAYING';`)).rows[0].id;
}

module.exports.resolvers = {
    Query: {    
        async usernameIsValid(_, args, context) {
            return await validateUserName(_, args, context);
        },

        async login(_, args, context) {
            const { username, password } = args;
            const { dbClient } = context;
            // save row
            const rows = (await dbClient.query(`SELECT * FROM Users WHERE username = '${username}';`)).rows
            // doesn't exist
            if(rows.length == 0) throw new ApolloError('Username does not exist.', 'USERNAME_DNE')
            const row = rows[0];
            // verify hash
            if(!bcrypt.compareSync(password, row.password_hash)) {
                throw new ApolloError(`Incorrect password for user ${username}.`, 'WRONG_PASSWORD')
            }
            // sign and return token
            console.log(process.env.JWT_SECRET_KEY)
            return jwt.sign({
                time: Date(), 
                userId: row.id
            }, process.env.JWT_SECRET_KEY);
        },

        async viewUsers(_, args, context) {
            verifyAuth(context);
            const { dbClient } = context;
            const rows = (await dbClient.query(`SELECT id, username, is_chess_board FROM Users`)).rows;
            for(let i=0;i<rows.length;i++) {
                rows[i] = constructUser(rows[i]);
            }
            return rows;
        },

        async viewRecievedRequests(_, args, context) {
            verifyAuth(context);
            const { dbClient, userId } = context;
            // requests where you are reciever
            const rows = (await dbClient.query(`SELECT * FROM Requests WHERE reciever_id = ${userId}`)).rows
            const dbGqlMap = {
                'id': 'id',
                'sender_id': 'sender',
                'reciever_id': 'reciever',
                'sender_is_white': 'senderIsWhite',
                'request_status': 'status',
                'game_id': 'gameId', 
            }
            for(let row=0;row<rows.length;row++) {
                rows[row] = mapDbtoGql(dbGqlMap, rows[row])
                rows[row].sender = constructUser((await dbClient.query(`SELECT id, username, is_chess_board FROM Users WHERE id = ${rows[row].sender};`)).rows[0])
                rows[row].reciever = constructUser((await dbClient.query(`SELECT id, username, is_chess_board FROM Users WHERE id = ${rows[row].reciever};`)).rows[0])
            }
            return rows;
        },

        async viewSentRequests(_, args, context) {
            verifyAuth(context);
            const { dbClient, userId } = context;
            // requests where you are reciever
            const rows = (await dbClient.query(`SELECT * FROM Requests WHERE sender_id = ${userId}`)).rows
            const dbGqlMap = {
                'id': 'id',
                'sender_id': 'sender',
                'reciever_id': 'reciever',
                'sender_is_white': 'senderIsWhite',
                'request_status': 'status',
                'game_id': 'gameId', 
            }
            for(let row=0;row<rows.length;row++) {
                rows[row] = mapDbtoGql(dbGqlMap, rows[row])
                rows[row].sender = constructUser((await dbClient.query(`SELECT id, username, is_chess_board FROM Users WHERE id = ${rows[row].sender};`)).rows[0])
                rows[row].reciever = constructUser((await dbClient.query(`SELECT id, username, is_chess_board FROM Users WHERE id = ${rows[row].reciever};`)).rows[0])
            }
            return rows;
        }, 
        
        getActiveGameId, 

        async getGameStatus(_, args, context) {
            verifyAuth(context);
            const { dbClient, userId } = context;
            // check if game is valid and grab the ID
            const gameId = await getActiveGameId(_, args, context);
            // get the DB representation
            const gameDb = (await dbClient.query(`SELECT * FROM Games WHERE id = ${gameId};`)).rows[0]
            const dbGqlMap = {
                'id': 'id',
                'game_state': 'state',
                'white_user_id': 'whiteUser',
                'black_user_id': 'blackUser',
                'is_white_turn': 'isWhiteTurn',
            }
            const gameGql = mapDbtoGql(dbGqlMap, gameDb);
            gameGql.whiteUser = constructUser((await dbClient.query(`SELECT id, username, is_chess_board FROM Users WHERE id = ${gameGql.whiteUser};`)).rows[0])
            gameGql.blackUser = constructUser((await dbClient.query(`SELECT id, username, is_chess_board FROM Users WHERE id = ${gameGql.blackUser};`)).rows[0])
            pieces = (await dbClient.query(`SELECT piece_type, is_white, letter_coordinate, number_coordinate FROM Pieces WHERE game_id = ${gameId};`)).rows;
            gameGql.pieces = [];
            pieceDbGqlMap = {
                'piece_type': 'piece',
                'is_white': 'isWhite',
                'letter_coordinate': 'letterCoordinate',
                'number_coordinate': 'numberCoordinate',
            }
            for(let i=0;i<pieces.length;i++){
                gameGql.pieces.push(mapDbtoGql(pieceDbGqlMap, pieces[i]))
            }
            return gameGql;
        }
    }, 
    Mutation: {
        async register(_, args, context) {
            const { username, password, isBoard } = args;
            const { dbClient } = context;
            // throw an error if username is invalid
            await validateUserName(_, {username: username}, context)
            // reject empty password.
            if(password == "") throw new ApolloError('Please Enter a password.', 'NO_PASSWORD')
            // success, commit to database with bcrypt hasher
            console.log(`INSERT INTO Users (username, password_hash, is_chess_board) VALUES ('${username}', '${bcrypt.hashSync(password, 10)}', ${isBoard})`);
            await dbClient.query(`INSERT INTO Users (username, password_hash, is_chess_board) VALUES ('${username}', '${bcrypt.hashSync(password, 10)}', ${isBoard})`)
            return true;
        },
        
        async sendRequest(_, args, context) {
            verifyAuth(context);
            const { friendId, senderIsWhite } = args;
            const { dbClient, userId } = context;
            // check if we are occupied (in game returns something)
            if(await isInGame(userId, context)) throw new ApolloError('Cannot send a request while in game.', 'SENDER_IN_GAME');
            // check if the other user is occupied
            if(await isInGame(friendId, context)) throw new ApolloError(`Sorry! The other player is in game at the moment.`, 'RECIEVER_IN_GAME')
            // check if the other user is a chess board
            const blackUserSearch = (await dbClient.query(`SELECT * FROM Users WHERE id = ${friendId}`)).rows
            if(blackUserSearch.length == 0) throw new ApolloError('The reciever does not exist.', 'RECIEVER_DOES_NOT_EXIST')
            // create and commit the request
            await dbClient.query(`INSERT INTO Requests (
                sender_id, 
                reciever_id,
                sender_is_white, 
                request_status
            )
            VALUES (
                ${userId},
                ${friendId}, 
                ${senderIsWhite}, 
                'PENDING'
            );`)
            return true;
        },

        async acceptRequest(_, args, context) {
            verifyAuth(context);
            const { requestId } = args;
            const { dbClient, userId } = context;
            // check if request exists
            const rows = (await dbClient.query(`SELECT * FROM Requests WHERE id = ${requestId};`)).rows;
            if(rows.length == 0) throw new ApolloError('Request does not exist.', 'REQUEST_DOES_NOT_EXIST')
            // check if we are the recieving end of the request
            const row = rows[0];
            if(row.reciever_id != userId) throw new ApolloError('Request is not addressed to you.', 'REQUEST_RECIEVER_NOT_USER') 
            // check if the request status is currently pending
            if(row.request_status != 'PENDING') throw new ApolloError('Request is not pending, and cannot be accepted', 'REQUEST_STATUS_NOT_PENDING')
            // accept request
            // game startup functions
            // create a game and retrieve its id
            
            const gameId = (await dbClient.query(`INSERT INTO Games (
                game_state,
                white_wins,
                white_user_id,
                black_user_id,
                is_white_turn,
            ) VALUES (
                'PLAYING',
                False,
                ${row.sender_is_white?row.sender_id:row.reciever_id},
                ${row.sender_is_white?row.reciever_id:row.sender_id},
                True
            ) RETURNING id;`)).rows[0].id;
            // set the request's game id to the game, and the request's status to in game
            await dbClient.query(`UPDATE Requests SET request_status = 'ACCEPTED', game_id = ${gameId} WHERE id = ${requestId};`)
            // create pieces, with their game id set to the game
            backRow = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
            pawnRow = [];
            for(let i=0;i<8;i++) pawnRow.push('pawn');
            async function createRow(pieceRow, rowNumber, isWhite) {
                for(let i=0;i<8;i++) {
                    await dbClient.query(`INSERT INTO Pieces (
                        is_white, 
                        piece_type,
                        letter_coordinate, 
                        number_coordinate, 
                        game_id
                    ) VALUES (
                        ${isWhite},
                        '${pieceRow[i]}',
                        '${String.fromCharCode('a'.charCodeAt(0)+i)}',
                        ${rowNumber},
                        ${gameId}
                    );`)
                }
            }
            await createRow(backRow, 8, false);
            await createRow(pawnRow, 7, false);
            await createRow(pawnRow, 2, true);
            await createRow(backRow, 1, true);

            global[gameId+'-chess-game'] = new Chess();
            console.log(global[gameId+'-chess-game']);
            
            return true;
        }, 

        async deferRequest(_, args, context) {
            verifyAuth(context);
            const { requestId } = args;
            const { dbClient, userId } = context;
            // check if request exists
            const rows = (await dbClient.query(`SELECT reciever_id, request_status FROM Requests WHERE id = ${requestId};`)).rows;
            if(rows.length == 0) throw new ApolloError('Request does not exist.', 'REQUEST_DOES_NOT_EXIST')
            // check if we are the recieving end of the request
            const row = rows[0];
            if(row.reciever_id != userId) throw new ApolloError('Request is not addressed to you.', 'REQUEST_RECIEVER_NOT_USER') 
            // check if the request status is currently pending
            if(row.request_status != 'PENDING') throw new ApolloError('Request is not pending, and cannot be rejected', 'REQUEST_STATUS_NOT_PENDING')
            // defer request
            await dbClient.query(`UPDATE Requests SET request_status = 'REJECTED' WHERE id = ${requestId};`)
            return true;
        },

        async cancelRequest(_, args, context) {
            verifyAuth(context);
            const { requestId } = args;
            const { dbClient, userId } = context;
            // check if request exists
            const rows = (await dbClient.query(`SELECT sender_id, request_status FROM Requests WHERE id = ${requestId};`)).rows;
            if(rows.length == 0) throw new ApolloError('Request does not exist.', 'REQUEST_DOES_NOT_EXIST')
            // check if we are the recieving end of the request
            const row = rows[0];
            if(row.sender_id != userId) throw new ApolloError('You did not send this request.', 'REQUEST_SENDER_NOT_USER') 
            // check if the request status is currently pending
            if(row.request_status != 'PENDING') throw new ApolloError('Request is not pending, and cannot be cancelled', 'REQUEST_STATUS_NOT_PENDING')
            // cancel request
            await dbClient.query(`UPDATE Requests SET request_status = 'CANCELLED' WHERE id = ${requestId};`)
            return true;
        },
        
        async move(_, args, context) {
            verifyAuth(context);      
            const { dbClient, userId } = context;
            const { pieceToMove, newPiece } = args;
            // check if game is valid and grab the ID
            const gameId = await getActiveGameId(_, args, context);
            // we could validate the board but we don't have time for that
            gameData = (await dbClient.query(`SELECT * FROM Games where id = ${gameId};`)).rows;
            if(gameData.length == 0) {
                throw new ApolloError('Not in Game!, NO_ACTIVE_GAME');
            }
            gameData = gameData[0];
            if(gameData.game_state != 'PLAYING') {
                throw new ApolloError('The game is already over, ended in '+gameData.game_state.toLowerCase(), 'GAME_OVER');
            }
            // at least validate the turn to avoid bugs
            userIsWhite = gameData.white_user_id == userId;
            if(gameData.is_white_turn != userIsWhite) throw new ApolloError('Not your turn!', 'IS_OPPONENTS_TURN') // if it's white's turn and black moved, or it's black's turn and white moved !? 
            
            //just assume it's valid
            if(!global[gameId]) global[gameId] = 1;
            global[gameId]++;

            //find the old piece and drop it
            await dbClient.query(`DELETE from Pieces WHERE
                piece_type = '${pieceToMove.piece}' AND
                is_white = ${pieceToMove.isWhite} AND
                letter_coordinate = '${pieceToMove.letterCoordinate}' AND
                number_coordinate = ${pieceToMove.numberCoordinate} AND
                game_id = ${gameId};`)
            // delete anything on the capture square
            await dbClient.query(`DELETE from Pieces WHERE
                is_white = ${!pieceToMove.isWhite} AND
                letter_coordinate = '${newPiece.letterCoordinate}' AND
                number_coordinate = ${newPiece.numberCoordinate} AND
                game_id = ${gameId};`);
            
            // insert the new piece
            await dbClient.query(`INSERT INTO Pieces (piece_type, is_white, letter_coordinate, number_coordinate, game_id) VALUES (
                '${newPiece.piece}',
                ${newPiece.isWhite}, 
                '${newPiece.letterCoordinate}',
                ${newPiece.numberCoordinate}, 
                ${gameId}
            );`)
            
            if(!global[gameId+'-chess-game']) global[gameId+'-chess-game'] = new Chess();
            global[gameId+'-chess-game'].move(pieceToMove.letterCoordinate+pieceToMove.numberCoordinate+'-'+newPiece.letterCoordinate+newPiece.numberCoordinate);

            // update game state variables
            //console.log(gameData)
            //console.log(gameData.last_turn_end_time)
            
            // change turn
            gameData.is_white_turn = !gameData.is_white_turn;

            let whiteWins = false;
            let gameState = gameData.game_state;
            if(global[gameId+'-chess-game'].isCheckmate()) {
                gameState = 'CHECKMATE';
                if(newPiece.isWhite) whiteWins = true;
            } else if(global[gameId+'-chess-game'].isStalemate()) {
                gameState = 'STALEMATE';
            } 

            await dbClient.query(`UPDATE Games SET
                game_state = '${gameState}',
                white_wins = ${whiteWins},
                is_white_turn = ${gameData.is_white_turn} 
            WHERE id=${gameId};`)
            return true;
        }

    }
}