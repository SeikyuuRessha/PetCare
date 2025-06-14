import { PetGender } from "../../../src/common/enums";

const basePet = {
    petId: "pet-1",
    name: "Buddy",
    gender: PetGender.MALE,
    species: "DOG",
    breed: "Golden Retriever",
    dateOfBirth: new Date("2020-01-15"),
    profileImage: "https://example.com/buddy.jpg",
    ownerId: "user-1",
    createdAt: new Date(),
    updatedAt: new Date(),
};

export const petTestCases = {
    create: {
        valid: {
            createPetDto: {
                name: "Buddy",
                gender: PetGender.MALE,
                species: "DOG",
                breed: "Golden Retriever",
                dateOfBirth: "2020-01-15",
                profileImage: "https://example.com/buddy.jpg",
            },
            ownerId: "user-1",
            expectedPet: basePet,
        },
        invalid: {
            missingName: {
                createPetDto: {
                    species: "DOG",
                    breed: "Golden Retriever",
                },
                ownerId: "user-1",
            },
            emptyName: {
                createPetDto: {
                    name: "",
                    species: "DOG",
                },
                ownerId: "user-1",
            },
            invalidGender: {
                createPetDto: {
                    name: "Buddy",
                    gender: "INVALID_GENDER" as any,
                },
                ownerId: "user-1",
            },
            invalidUrl: {
                createPetDto: {
                    name: "Buddy",
                    profileImage: "invalid-url",
                },
                ownerId: "user-1",
            },
        },
    },
    find: {
        byId: {
            valid: {
                petId: "pet-1",
                existingPet: basePet,
            },
            invalid: {
                petId: "non-existent",
            },
        },
        byOwner: {
            valid: {
                ownerId: "user-1",
                existingPets: [
                    basePet,
                    {
                        ...basePet,
                        petId: "pet-2",
                        name: "Max",
                        breed: "Labrador",
                    },
                ],
            },
        },
        all: {
            valid: {
                existingPets: [
                    basePet,
                    {
                        ...basePet,
                        petId: "pet-2",
                        ownerId: "user-2",
                        name: "Fluffy",
                        species: "CAT",
                        breed: "Persian",
                    },
                ],
            },
        },
    },
    update: {
        valid: {
            petId: "pet-1",
            updatePetDto: {
                name: "Buddy Updated",
                breed: "Golden Retriever Mix",
            },
            existingPet: basePet,
            expectedPet: {
                ...basePet,
                name: "Buddy Updated",
                breed: "Golden Retriever Mix",
                updatedAt: expect.any(Date),
            },
        },
        invalid: {
            petId: "non-existent",
            updatePetDto: {
                name: "Updated Name",
            },
        },
    },
    delete: {
        valid: {
            petId: "pet-1",
            existingPet: basePet,
        },
        invalid: {
            petId: "non-existent",
        },
    },
};
