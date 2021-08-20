import { AddressKeys } from "../nexus/types"

const SIMBOL = '@%@%'

const groupByAddressIdGenerator = (addressKey: AddressKeys, addressId: string): string => {
    return addressKey + SIMBOL + addressId
}

const groupByAddressIdParser = (groupByAddressId: string) => {
    const splitedId = groupByAddressId.split(SIMBOL)

    if (splitedId.length !== 2) throw new Error('Invalid \"groupByAddressId\"')

    const addressKey = splitedId[0]
    const addressId = splitedId[1]

    return {
        addressKey,
        addressId
    }
}


export default {
    generate: groupByAddressIdGenerator,
    parse: groupByAddressIdParser
}