import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers, parseUnits, formatEther } from "ethers";

// INTERNAL IMPORTS
import tracking from "../context/Tracking.json";

const ContractAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // ✅ Ensure the contract is deployed here
const ContractABI = tracking.abi;

// ---FETCHING SMART CONTRACT---
const fetchContract = (signerOrProvider) => 
  new ethers.Contract(ContractAddress, ContractABI, signerOrProvider);

export const TrackingContext = React.createContext();

export const TrackingProvider = ({ children }) => {
  const DappName = "Product Tracking Dapp";
  const [currentUser, setCurrentUser] = useState("");

  // ✅ Connect Wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error("Install MetaMask");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentUser(accounts[0]);
      console.log("Connected account:", accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error.message);
    }
  };

  // ✅ Check If Wallet Is Connected
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) throw new Error("Install MetaMask");

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentUser(accounts[0]);
        console.log("Connected account:", accounts[0]);
      } else {
        console.log("No account found");
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error.message);
    }
  };

  // ✅ Create Shipment
  const createShipment = async (items) => {
    const { receiver, pickupTime, distance, price } = items;

    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const contract = fetchContract(signer);

      const createItem = await contract.createShipment(
        receiver,
        new Date(pickupTime).getTime(),
        distance,
        parseUnits(price.toString(), "ether"),
        { value: parseUnits(price.toString(), "ether") }
      );
      await createItem.wait();
      console.log("Shipment Created:", createItem);
    } catch (error) {
      console.error("Error creating shipment:", error.reason || error.message);
    }
  };

  // ✅ Get All Shipments
  const getAllShipment = async () => {
    try {
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const contract = fetchContract(provider);

      const shipments = await contract.getShipments(currentUser);

      const allShipments = shipments.map((shipment) => ({
        sender: shipment.sender,
        receiver: shipment.receiver,
        price: formatEther(shipment.price.toString()),
        pickupTime: Number(shipment.pickupTime),
        deliveryTime: Number(shipment.deliveryTime),
        distance: Number(shipment.distance),
        isPaid: shipment.isPaid,
        status: shipment.status,
      }));

      console.log("All shipments:", allShipments);
      return allShipments;
    } catch (error) {
      console.error("Error fetching shipments:", error.reason || error.message);
    }
  };

  // ✅ Get Shipments Count (FIXED)
  const getShipmentsCount = async () => {
    try {
      if (!window.ethereum) throw new Error("Install MetaMask");

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (!accounts.length) throw new Error("No accounts found");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = fetchContract(signer);

      // ✅ Check if contract is deployed
      const code = await provider.getCode(ContractAddress);
      if (code === "0x") throw new Error("No contract deployed at this address");

      const shipmentCount = await contract.getShipmentCount(accounts[0]);
      console.log("Shipment count:", shipmentCount.toNumber());

      return shipmentCount.toNumber();
    } catch (error) {
      console.error(
        "Error fetching shipment count:",
        error.reason || error.message,
        error.code || "No error code",
        error.data || "No error data"
      );
    }
  };

  // ✅ Complete Shipment
  const completeShipment = async (completeShip) => {
    const { receiver, index } = completeShip;

    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const contract = fetchContract(signer);
      const transaction = await contract.completeShipment(
        currentUser,
        receiver,
        index,
        { gasLimit: 300000 }
      );

      await transaction.wait();
      console.log("Shipment completed:", transaction);
    } catch (error) {
      console.error("Error completing shipment:", error.reason || error.message);
    }
  };

  // ✅ Get Single Shipment
  const getShipment = async (index) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const shipment = await contract.getShipment(currentUser, index);

      return {
        sender: shipment.sender,
        receiver: shipment.receiver,
        pickupTime: Number(shipment.pickupTime),
        deliveryTime: Number(shipment.deliveryTime),
        distance: Number(shipment.distance),
        price: formatEther(shipment.price.toString()),
        status: shipment.status,
        isPaid: shipment.isPaid,
      };
    } catch (error) {
      console.error("Error fetching shipment:", error.reason || error.message);
    }
  };

  // ✅ Start Shipment
  const startShipment = async (getProduct) => {
    const { receiver, index } = getProduct;

    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      const contract = fetchContract(signer);
      const shipment = await contract.startShipment(currentUser, receiver, index);

      await shipment.wait();
      console.log("Shipment started:", shipment);
    } catch (error) {
      console.error("Error starting shipment:", error.reason || error.message);
    }
  };

  // ✅ Auto Connect Wallet On Load
  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  return (
    <TrackingContext.Provider
      value={{
        connectWallet,
        createShipment,
        getAllShipment,
        completeShipment,
        getShipment,
        startShipment,
        getShipmentsCount,
        DappName,
        currentUser,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};
