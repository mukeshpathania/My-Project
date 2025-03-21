// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Tracking {
    enum ShipmentStatus {
        PENDING,
        IN_TRANSIT,
        DELIVERED
    }

    struct Shipment {
        address sender;
        address receiver;
        uint256 pickupTime;
        uint256 deliveryTime;
        uint256 distance;
        uint256 price;
        ShipmentStatus status;
        bool isPaid;
    }

    mapping(address => Shipment[]) public shipments;
    uint256 public shipmentCount;

    event ShipmentCreated(
        address indexed sender,
        address indexed receiver,
        uint256 pickupTime,
        uint256 distance,
        uint256 price
    );

    event ShipmentInTransit(
        address indexed sender,
        address indexed receiver,
        uint256 pickupTime
    );

    event ShipmentDelivered(
        address indexed sender,
        address indexed receiver,
        uint256 deliveryTime
    );

    event ShipmentPaid(
        address indexed sender,
        address indexed receiver,
        uint256 amount
    );

    constructor() {
        shipmentCount = 0;
    }

    function createShipment(
        address _receiver,
        uint256 _pickupTime,
        uint256 _distance,
        uint256 _price
    ) public payable {
        require(msg.value == _price, "Payment amount must match the price.");

        Shipment memory shipment = Shipment(
            msg.sender,
            _receiver,
            _pickupTime,
            0,
            _distance,
            _price,
            ShipmentStatus.PENDING,
            true
        );

        shipments[msg.sender].push(shipment);
        shipmentCount++;

        emit ShipmentCreated(msg.sender, _receiver, _pickupTime, _distance, _price);
    }

    function updateShipmentStatus(uint256 _index, ShipmentStatus _status) public {
        require(_index < shipments[msg.sender].length, "Invalid shipment index.");

        shipments[msg.sender][_index].status = _status;

        if (_status == ShipmentStatus.IN_TRANSIT) {
            emit ShipmentInTransit(
                msg.sender,
                shipments[msg.sender][_index].receiver,
                shipments[msg.sender][_index].pickupTime
            );
        } else if (_status == ShipmentStatus.DELIVERED) {
            shipments[msg.sender][_index].deliveryTime = block.timestamp;
            emit ShipmentDelivered(
                msg.sender,
                shipments[msg.sender][_index].receiver,
                block.timestamp
            );
        }
    }

    // Public getter for frontend to retrieve shipment details
    function getShipments(address _sender) public view returns (Shipment[] memory) {
        return shipments[_sender];
    }
}
