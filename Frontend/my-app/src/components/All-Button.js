import React, { useState, useEffect } from "react";
import Contract from "../abis/MyToken.json";
import { ethers } from "ethers";

const AllButton = () => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [contractInstance, setContractInstance] = useState(null);
  const [getBalanceAddress, setGetBalanceAddress] = useState("");
  const [mintAddress, setMintAddress] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [approveAddress, setApproveAddress] = useState("");
  const [approveAmount, setApproveAmount] = useState("");
  const [transferFromAddress, setTransferFromAddress] = useState("");
  const [transferToAddress, setTransferToAddress] = useState("");
  const [transferFromAmount, setTransferFromAmount] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts) => {
        console.log("Running", contractInstance);
        setAddress(accounts[0]);
        if (contractInstance) {
          const balance = await contractInstance.balanceOf(accounts[0]);
          setBalance(ethers.utils.formatEther(balance));
        }
      });
    }
  }, [contractInstance]);

  const renderBalance = () => {
    return <p className="alert alert-info">Balance: {balance} MTK</p>;
  };

  const connectToWallet = async () => {
    try {
      if (window.ethereum) {
        const accountAddress = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        setAddress(accountAddress[0]);
        console.log(address);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const myContract = new ethers.Contract(
          Contract.address,
          Contract.abi,
          signer
        );

        const balanceNow = await myContract.balanceOf(accountAddress[0]);
        setBalance(ethers.utils.formatEther(balanceNow));

        setContractInstance(myContract);
        alert("Connected");
      } else {
        alert("Install MetaMask extension!");
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  const checkConnected = () => {
    if (!address) {
      alert("Please connect to your wallet first.");
      return;
    }
  };

  const mintToken = async () => {
    try {
      checkConnected();
      if (!mintAddress || !mintAmount) {
        alert("Please fill in all fields.");
        return;
      }
      const mint = await contractInstance.mint(
        mintAddress,
        ethers.utils.parseEther(mintAmount)
      );
      const transactionHash = await mint.wait();
      console.log("Transaction Hash:", transactionHash);
      alert(`Transferred ${mintAmount} tokens to ${mintAddress}`);
    } catch (error) {
      console.error("Error minting token:", error);
    }
  };

  const getBalanceOf = async () => {
    try {
      checkConnected();
      if (!getBalanceAddress) {
        alert("Please fill in all fields.");
        return;
      }
      const balance = await contractInstance.balanceOf(getBalanceAddress);
      alert(
        `Balance of ${getBalanceAddress}: ${ethers.utils.formatEther(
          balance
        )} tokens`
      );
    } catch (error) {
      console.error("Error getting balance:", error);
    }
  };

  const transferTo = async () => {
    try {
      checkConnected();
      if (!toAddress || !transferAmount) {
        alert("Please fill in all fields.");
        return;
      }
      const transaction = await contractInstance.transfer(
        toAddress,
        ethers.utils.parseEther(transferAmount)
      );
      const transactionHash = await transaction.wait();
      console.log("Transfer Transaction Hash:", transactionHash);
      alert(`Transferred ${transferAmount} tokens to ${toAddress}`);
    } catch (error) {
      console.error("Error transferring tokens:", error);
    }
  };

  const approve = async () => {
    try {
      checkConnected();
      if (!approveAddress || !approveAmount) {
        alert("Please fill in all fields.");
        return;
      }
      const transaction = await contractInstance.approve(
        approveAddress,
        ethers.utils.parseEther(approveAmount)
      );
      const transactionHash = await transaction.wait();
      console.log("Approve Transaction Hash:", transactionHash);
      alert(`Approved ${approveAmount} tokens for ${approveAddress}`);
    } catch (error) {
      console.error("Error approving tokens:", error);
    }
  };

  const transferFromTo = async () => {
    try {
      checkConnected();
      if (!transferFromAddress || !transferToAddress || !transferFromAmount) {
        alert("Please fill in all fields.");
        return;
      }
      const transaction = await contractInstance.transferFrom(
        transferFromAddress,
        transferToAddress,
        ethers.utils.parseEther(transferFromAmount)
      );
      const transactionHash = await transaction.wait();
      console.log("TransferFrom Transaction Hash:", transactionHash);
      alert(
        `Transferred ${transferFromAmount} tokens from ${transferFromAddress} to ${transferToAddress}`
      );
    } catch (error) {
      console.error("Error transferring tokens:", error);
    }
  };

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossorigin="anonymous"
      ></link>

      {!address && (
        <button className="btn btn-primary m-5" onClick={connectToWallet}>
          Connect Wallet
        </button>
      )}

      {address && (
        <p className="alert alert-success text-primary">
          Connected Address: {address}
        </p>
      )}
      {address && renderBalance()}

      {/* Get Balance */}
      <div className="form-group row d-flex align-items-center">
        <label className="col-md-2 text-right">
          Get Balance <span className="text-danger">*</span>
        </label>
        <input
          className="form-control col-md-3 mr-4"
          type="text"
          placeholder="Enter Address"
          value={getBalanceAddress}
          onChange={(e) => setGetBalanceAddress(e.target.value)}
        />
        <button className="btn btn-primary" onClick={getBalanceOf}>
          Get{" "}
        </button>
      </div>

      {/* Mint */}
      <div className="form-group row d-flex align-items-center">
        <label className="col-md-2 text-right">
          Mint Address <span className="text-danger">*</span>
        </label>
        <input
          className="form-control col-md-3 mr-4"
          type="text"
          placeholder="Enter Mint Address"
          value={mintAddress}
          onChange={(e) => setMintAddress(e.target.value)}
        />
        <input
          className="form-control col-md-3 mr-4"
          type="number"
          placeholder="Enter Mint Amount"
          value={mintAmount}
          onChange={(e) => setMintAmount(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={() => mintToken(mintAddress, mintAmount)}
        >
          Mint
        </button>
      </div>

      {/* Transfer */}
      <div className="form-group row d-flex align-items-center">
        <label className="col-md-2 text-right">
          Transfer To <span className="text-danger">*</span>
        </label>
        <input
          className="form-control col-md-3 mr-4"
          type="text"
          placeholder="Recipient Address"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
        />
        <input
          className="form-control col-md-3 mr-4"
          type="number"
          placeholder="Transfer Amount"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
        />
        <button className="btn btn-primary" onClick={transferTo}>
          Transfer
        </button>
      </div>

      {/* Approve */}
      <div className="form-group row d-flex align-items-center">
        <label className="col-md-2 text-right">
          Approve Spender <span className="text-danger">*</span>
        </label>
        <input
          className="form-control col-md-3 mr-4"
          type="text"
          placeholder="Spender Address"
          value={approveAddress}
          onChange={(e) => setApproveAddress(e.target.value)}
        />
        <input
          className="form-control col-md-3 mr-4"
          type="number"
          placeholder="Approval Amount"
          value={approveAmount}
          onChange={(e) => setApproveAmount(e.target.value)}
        />
        <button className="btn btn-primary" onClick={approve}>
          Approve
        </button>
      </div>

      {/* Transfer From */}
      <div className="form-group row d-flex align-items-center">
        <label className="col-md-2 text-right">
          From Address <span className="text-danger">*</span>
        </label>
        <input
          className="form-control col-md-2 mr-2"
          type="text"
          placeholder="Enter From Address"
          value={transferFromAddress}
          onChange={(e) => setTransferFromAddress(e.target.value)}
        />
        <input
          className="form-control col-md-2 mr-3"
          type="text"
          placeholder="Enter To Address"
          value={transferToAddress}
          onChange={(e) => setTransferToAddress(e.target.value)}
        />
        <input
          className="form-control col-md-2 mr-4"
          type="number"
          placeholder="Enter Transfer From Amount"
          value={transferFromAmount}
          onChange={(e) => setTransferFromAmount(e.target.value)}
        />
        <button className="btn btn-primary" onClick={transferFromTo}>
          Transfer
        </button>
      </div>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js"
        integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
        crossorigin="anonymous"
      ></script>
    </div>
  );
};

export default AllButton;
