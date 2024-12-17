// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Контракт для продажи цифрового контента
contract DigitalContentStore {

    // Структура для хранения данных о контенте
    struct Content {
        string name; // Название контента
        string ipfsHash; // Хэш IPFS файла (уникальный идентификатор файла в IPFS)
        uint256 price; // Цена контента в Wei (младшая единица ETH)
        address payable creator; // Адрес автора/создателя контента
    }

    // Маппинг для хранения контента по уникальному ID
    mapping(uint256 => Content) public contents;

    // Маппинг для хранения информации о том, кто купил какой контент
    // Адрес покупателя => (ID контента => bool)
    mapping(address => mapping(uint256 => bool)) public hasAccess;

    // Счетчик для уникальных ID контента
    uint256 public contentCount;

    // События для отслеживания действий в блокчейне
    event ContentAdded(uint256 contentId, string name, uint256 price, address indexed creator);
    event ContentPurchased(uint256 contentId, address indexed buyer);

    // Функция для добавления нового контента в магазин
    function addContent(string memory _name, string memory _ipfsHash, uint256 _price) public {
        require(_price > 0, "The price must be greater than zero"); // Проверяем, что цена корректна

        contentCount++; // Увеличиваем счетчик ID контента

        // Создаем новый контент и сохраняем его в маппинге
        contents[contentCount] = Content(_name, _ipfsHash, _price, payable(msg.sender));

        // Вызываем событие добавления контента
        emit ContentAdded(contentCount, _name, _price, msg.sender);
    }

    // Функция для покупки контента
    function purchaseContent(uint256 _contentId) public payable {
        Content memory content = contents[_contentId]; // Получаем данные о контенте
        require(content.price > 0, "The content does not exist"); // Проверяем, что контент существует
        require(msg.value == content.price, "Incorrect payment amount"); // Проверяем, что отправленная сумма равна цене
        require(!hasAccess[msg.sender][_contentId], "Already purchased"); // Проверяем, что пользователь еще не купил этот контент

        // Переводим оплату создателю контента
        content.creator.transfer(msg.value);

        // Обновляем данные о доступе пользователя к контенту
        hasAccess[msg.sender][_contentId] = true;

        // Вызываем событие покупки контента
        emit ContentPurchased(_contentId, msg.sender);
    }

    // Функция для получения ссылки на контент (IPFS-хэш)
    function getContent(uint256 _contentId) public view returns (string memory) {
        require(hasAccess[msg.sender][_contentId], "Access is denied"); // Проверяем, что пользователь купил контент
        return contents[_contentId].ipfsHash; // Возвращаем хэш IPFS
    }
}
