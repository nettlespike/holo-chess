import * as React from 'react';
import logo from '../images/logo.png';
import {Routes, Route, Navigate} from 'react-router-dom';
import {Link} from "react-router-dom";

class ProductSquare extends React.Component {
render() {
    return <img src={logo} />;
}
}

function Login () {
return (
    <div className="flex w-full h-screen" >
        <div className="w-full flex items-center justify-center lg:w-1/2">
            <div className='bg-white px-10 py-20 rounded-3xl border-2 border-gray-100'>
                <h1 className='text-5xl font-semibold'>Welcome Back</h1>
                <p className='font-medium text-lg text-gray-500 mt-4'>Welcome back to HoloChess! Please enter your credentials.</p>
                <div className='mt-8'>
                    <div>
                        <label className='text-lg font-medium'>Email</label>
                        <input
                            className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1'
                            placeholder='Enter your email'
                        />
                    </div>
                    <div>
                        <label className='text-lg font-medium'>Password</label>
                        <input
                            className='w-full border-2 border-gray-100 rounded-xl p-4 '
                            placeholder='Enter your Password'
                        />
                    </div>
                    <div className='mt-8 flex justify-between items-center'>
                        <div>
                            <input
                                type="checkbox"
                                id = 'remember'
                            />
                            <label className='ml-2 font-medium text-base'for="remember">Remember for 30 days </label>
                        </div>
                        <button className='font-medium text-base text-blue-500'>Forgot password</button>
                    </div>
                    <div className='mt-8 flex flex-col gap-y-4'>
                        <Link to="/home" className='flex justify-center active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-3 rounded-xl bg-blue-500 text-white text-lg font-bold items-center'>
                            Sign In
                        </Link>
                        
                    </div>
                    <div className='mt-8 flex justify-center items-center'>
                        <p className='font-medium text-base'>Don't have an account?</p>
                        <Link to="/SignUp">
                            <button className='text-blue-500 text-base font-medium ml-2'>Sign up</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
            <div className="hidden relative lg:flex h-full w-1/2 items-center justify-center bg-gray-200">
            <div className="w-80 h-80 bg-gradient-to-tr from-blue-500 to-yellow-500 rounded-full motion-safe:animate-pulse"/>
            <div className="w-full h-1/2 absolute backdrop-blur-lg"/>
            <img src={ logo } className="w-80 h-80 absolute" />
        </div>
    </div>
)
}
export default Login;