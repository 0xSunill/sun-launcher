import React from 'react'

const Footer = () => {
    return (
        <footer className=" bottom-0 left-0 right-0 z-50 w-full bg-[#0D1117] border-t border-gray-800 px-4 md:px-20 py-6 text-white mt-12">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm gap-4">
                <p className="text-gray-400">&copy; {new Date().getFullYear()} Sun Launcher. All rights reserved.</p>
                <div className="flex gap-4">
                    <a
                        href="https://github.com/0xSunill"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-400 transition"
                    >
                        GitHub
                    </a>
                    <a
                        href="https://twitter.com/0xSunill"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-400 transition"
                    >
                        Twitter
                    </a>
                    <a
                        
                        className="hover:text-purple-400 transition"
                    >
                        Privacy Policy
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer
