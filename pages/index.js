import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Web3Modal from 'web3modal'
import { useEffect, useRef, useState } from 'react'
import { ethers, providers } from 'ethers';

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [ens, setEns] = useState("");
  const web3ModalRef = useRef();
  const [address, setAddress] = useState("");

  const setENSOrAddress = async (address, web3Provider) => {
    let _ens = await web3Provider.lookupAddress(address);
    if (_ens) {
      setEns(_ens);
    } else {
      setAddress(address);
    }
  }

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      alert("Change the network to Goerli.");
      throw new Error("Change the network to Goerli");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();
      setENSOrAddress(address, web3Provider);

      return signer;
    }
    return provider;
  }

  const connectWallet = async () => {
    try {
      await getProviderOrSigner(true);
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  }

  const renderButton = () => {
    if (walletConnected) {
      <div>{address.slice(0, 4)}....{address.slice(-1, -4)}</div>
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  }

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);
  return (
    <div>
      <Head>
        <title>ENS Dapp</title>
        <meta name="description" content="ENS-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>
            Welcome to LearnWeb3 Punks <span className={styles.ens}>{ens ? ens : address}!</span>
          </h1>
          <div className={styles.description}>
            Its an NFT collection for LearnWeb3 Punks.
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./learnweb3punks.png" />
        </div>
      </div>
    </div>
  )
}
