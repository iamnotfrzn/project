import { useState } from "react";
import { ethers } from "ethers";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const AddContent = () => {
  const [name, setName] = useState(""); // Состояние для названия контента
  const [ipfsHash, setIpfsHash] = useState(""); // Состояние для хэша IPFS
  const [price, setPrice] = useState(""); // Состояние для цены

  // Хук для вызова функции addContent из смарт-контракта
  const { writeContractAsync, isMining } = useScaffoldWriteContract("DigitalContentStore");

  // Обработчик отправки формы
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!name || !ipfsHash || !price) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    try {
      // Вызов функции addContent с аргументами
      await writeContractAsync({
        functionName: "addContent", // Функция смарт-контракта
        args: [name, ipfsHash, ethers.parseEther(price)],
      });
      alert("Контент успешно добавлен!");
      setName("");
      setIpfsHash("");
      setPrice("");
    } catch (error) {
      console.error(error);
      alert("Ошибка при добавлении контента");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 my-4">
      <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">Добавить контент</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Поле ввода для названия контента */}
        <input
          type="text"
          placeholder="Название контента"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
        />
        {/* Поле ввода для хэша IPFS */}
        <input
          type="text"
          placeholder="IPFS Хэш"
          value={ipfsHash}
          onChange={e => setIpfsHash(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
        />
        {/* Поле ввода для цены контента */}
        <input
          type="text"
          placeholder="Цена (ETH)"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
        />
        {/* Кнопка отправки формы */}
        <button
          type="submit"
          disabled={isMining} // Блокируем кнопку во время загрузки
          className={`w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 ${
            isMining ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isMining ? "Добавление..." : "Добавить"}
        </button>
      </form>
    </div>
  );
};

const PurchaseContent = () => {
  const [contentId, setContentId] = useState(""); // Состояние для ID контента
  const [price, setPrice] = useState(""); // Состояние для цены контента

  // Хук для вызова функции purchaseContent из смарт-контракта
  const { writeContractAsync, isMining } = useScaffoldWriteContract("DigitalContentStore");

  // Обработчик отправки формы
  const handlePurchase = async (e: any) => {
    e.preventDefault();
    if (!contentId || !price) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    try {
      // Вызов функции purchaseContent с передачей цены в ETH
      await writeContractAsync({
        functionName: "purchaseContent", // Функция смарт-контракта
        args: [BigInt(contentId)],
        value: ethers.parseEther(price),
      });
      alert("Контент успешно приобретен!");
      setContentId("");
      setPrice("");
    } catch (error) {
      console.error(error);
      alert("Ошибка при покупке контента");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 my-4">
      <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">Купить контент</h2>
      <form onSubmit={handlePurchase} className="space-y-4">
        {/* Поле ввода для ID контента */}
        <input
          type="text"
          placeholder="ID контента"
          value={contentId}
          onChange={e => setContentId(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
        />
        {/* Поле ввода для цены */}
        <input
          type="text"
          placeholder="Цена (ETH)"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
        />
        {/* Кнопка отправки формы */}
        <button
          type="submit"
          disabled={isMining} // Блокируем кнопку во время загрузки
          className={`w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 ${
            isMining ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isMining ? "Покупка..." : "Купить"}
        </button>
      </form>
    </div>
  );
};

const GetContent = () => {
  const [contentId, setContentId] = useState(""); // Состояние для ID контента
  const [ipfsHash, setIpfsHash] = useState(""); // Состояние для хэша IPFS

  // Хук для вызова функции getContent из смарт-контракта
  const { data: hash } = useScaffoldReadContract({
    contractName: "DigitalContentStore", // Имя контракта
    functionName: "getContent", // Функция смарт-контракта
    args: [BigInt(contentId)],
  });

  // Обработчик отправки формы
  const handleGetContent = async (e: any) => {
    e.preventDefault();
    if (!contentId) {
      alert("Пожалуйста, введите ID контента");
      return;
    }

    try {
      // Вызов функции getContent для получения хэша IPFS
      setIpfsHash(hash ? hash : "");
    } catch (error) {
      console.error(error);
      alert("Ошибка при получении контента");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 my-4">
      <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">Получить контент</h2>
      <form onSubmit={handleGetContent} className="space-y-4">
        {/* Поле ввода для ID контента */}
        <input
          type="text"
          placeholder="ID контента"
          value={contentId}
          onChange={e => setContentId(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
        />
        {/* Кнопка отправки формы */}
        <button type="submit" className={`w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700`}>
          {"Получить"}
        </button>
      </form>
      {/* Вывод хэша IPFS, если он есть */}
      {ipfsHash && (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-gray-700 font-semibold">IPFS Хэш:</h3>
          <p className="text-gray-600">{ipfsHash}</p>
        </div>
      )}
    </div>
  );
};

export { AddContent, PurchaseContent, GetContent };
