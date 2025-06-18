import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
  provider: ethers.BrowserProvider | null;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    chainId: null,
    provider: null,
  });

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    try {
      setWallet(prev => ({ ...prev, isConnecting: true }));
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      
      setWallet({
        address,
        isConnected: true,
        isConnecting: false,
        chainId: Number(network.chainId),
        provider,
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setWallet(prev => ({ ...prev, isConnecting: false }));
    }
  };

  const disconnectWallet = () => {
    setWallet({
      address: null,
      isConnected: false,
      isConnecting: false,
      chainId: null,
      provider: null,
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const address = accounts[0].address;
            const network = await provider.getNetwork();
            
            setWallet({
              address,
              isConnected: true,
              isConnecting: false,
              chainId: Number(network.chainId),
              provider,
            });
          }
        } catch (error) {
          console.error('Failed to check wallet connection:', error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          checkConnection();
        }
      });

      window.ethereum.on('chainChanged', () => {
        checkConnection();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return {
    ...wallet,
    connectWallet,
    disconnectWallet,
    formatAddress,
  };
}