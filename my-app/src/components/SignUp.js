import * as React from 'react';
import logo from '../images/logo.png';
import {Link} from "react-router-dom";

class ProductSquare extends React.Component {
    render() {
        return <img src={logo} />;
    }
}

export default function SignUp() {
return (
    <div className="flex w-full h-screen" >
        <div className="w-full flex items-center justify-center lg:w-1/2">
           
            <div className='bg-white px-10 py-20 rounded-3xl border-2 border-gray-100'>
            <h1 className='text-5xl font-semibold'>Create Your Account</h1>
            <p className='font-medium text-lg text-gray-500 mt-4'>Welcome to HoloChess! Get started now.</p>
            <div className='mt-8'>
                <div>
                    <label className='text-lg font-medium'>Email</label>
                    <input
                        className='w-full border-2 border-gray-100 rounded-xl p-4 mt-1'
                        placeholdnper='Enter your email'
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
                </div>
                <div className='mt-8 flex flex-col gap-y-4'>
                    <Link to="/" className='flex justify-center active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-3 rounded-xl bg-blue-500 text-white text-lg font-bold items-center'>
                            Sign Up
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
