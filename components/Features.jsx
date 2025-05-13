import React from 'react'

const Features = () => {
    return (
        <section className="bg-black py-20 px-4 md:px-20 pt-20">
            <div className="text-center mb-16">
                <h3 className="text-purple-500 font-semibold text-sm tracking-widest uppercase">Features</h3>
                <h2 className="text-4xl sm:text-5xl font-bold text-white mt-2">
                    Everything you need to launch on Solana
                </h2>
                <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                    Sun Launcher provides you with powerful tools to create, mint, and manage Solana tokens effortlessly — all without writing code.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
      
                <div className="flex items-start space-x-4">
                    <div className="bg-purple-600 text-white p-3 rounded-lg">
                        <i className="fas fa-rocket text-xl"></i>
                    </div>
                    <div>
                        <h4 className="text-white text-xl font-semibold">One-Click Token Creation</h4>
                        <p className="text-gray-400 mt-1">
                            Launch your Solana token instantly with just a few inputs. No technical skills required.
                        </p>
                    </div>
                </div>

              
                <div className="flex items-start space-x-4">
                    <div className="bg-purple-600 text-white p-3 rounded-lg">
                        <i className="fas fa-bolt text-xl"></i>
                    </div>
                    <div>
                        <h4 className="text-white text-xl font-semibold">Lightning-Fast Transactions</h4>
                        <p className="text-gray-400 mt-1">
                            Powered by Solana's high-speed network to ensure ultra-fast transfers and minting.
                        </p>
                    </div>
                </div>

              
                <div className="flex items-start space-x-4">
                    <div className="bg-purple-600 text-white p-3 rounded-lg">
                        <i className="fas fa-shield-alt text-xl"></i>
                    </div>
                    <div>
                        <h4 className="text-white text-xl font-semibold">Secure Smart Contracts</h4>
                        <p className="text-gray-400 mt-1">
                            Your tokens are created using audited Solana programs with secure architecture.
                        </p>
                    </div>
                </div>

                <div className="flex items-start space-x-4">
                    <div className="bg-purple-600 text-white p-3 rounded-lg">
                        <i className="fas fa-wallet text-xl"></i>
                    </div>
                    <div>
                        <h4 className="text-white text-xl font-semibold">Wallet Integration</h4>
                        <p className="text-gray-400 mt-1">
                            Easily connect Phantom or Solflare wallet and manage your tokens in real-time.
                        </p>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default Features