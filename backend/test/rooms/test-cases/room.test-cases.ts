import { RoomStatus } from "../../../src/common/enums";

const baseRoom = {
    roomId: "room-1",
    roomNumber: 101,
    capacity: 2,
    status: RoomStatus.AVAILABLE,
    description: "Comfortable room for small pets",
    price: 50.0,
};

export const roomTestCases = {
    create: {
        valid: {
            createRoomDto: {
                roomNumber: 101,
                capacity: 2,
                description: "Comfortable room for small pets",
                price: 50.0,
            },
            expectedRoom: baseRoom,
        },
        invalid: {
            missingRoomNumber: {
                createRoomDto: {
                    capacity: 2,
                    description: "Room without number",
                },
            },
            missingCapacity: {
                createRoomDto: {
                    roomNumber: 102,
                    description: "Room without capacity",
                },
            },
            negativeRoomNumber: {
                createRoomDto: {
                    roomNumber: -1,
                    capacity: 2,
                },
            },
            negativeCapacity: {
                createRoomDto: {
                    roomNumber: 103,
                    capacity: -1,
                },
            },
            duplicateRoomNumber: {
                createRoomDto: {
                    roomNumber: 101, // Already exists
                    capacity: 2,
                },
            },
        },
    },
    find: {
        byId: {
            valid: {
                roomId: "room-1",
                existingRoom: baseRoom,
            },
            invalid: {
                roomId: "non-existent",
            },
        },
        all: {
            valid: {
                existingRooms: [
                    baseRoom,
                    {
                        ...baseRoom,
                        roomId: "room-2",
                        roomNumber: 102,
                        capacity: 4,
                        description: "Large room for bigger pets",
                        price: 75.0,
                    },
                ],
            },
        },
        available: {
            valid: {
                availableRooms: [
                    baseRoom,
                    {
                        ...baseRoom,
                        roomId: "room-3",
                        roomNumber: 103,
                        status: RoomStatus.AVAILABLE,
                    },
                ],
            },
        },
    },
    update: {
        valid: {
            roomId: "room-1",
            updateRoomDto: {
                capacity: 3,
                description: "Updated room description",
                price: 60.0,
            },
            existingRoom: baseRoom,
            expectedRoom: {
                ...baseRoom,
                capacity: 3,
                description: "Updated room description",
                price: 60.0,
            },
        },
        invalid: {
            roomId: "non-existent",
            updateRoomDto: {
                capacity: 3,
            },
        },
    },
    delete: {
        valid: {
            roomId: "room-1",
            existingRoom: baseRoom,
        },
        invalid: {
            roomId: "non-existent",
        },
    },
};
