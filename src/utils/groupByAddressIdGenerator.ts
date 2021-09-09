import { AddressKeys } from "../nexus/types"
import apolloError from "./apolloError"

const SIMBOL = '@%@%'

const groupByAddressIdGenerator = (addressKey: AddressKeys, addressId: string): string => {
    return addressKey + SIMBOL + addressId
}

const groupByAddressIdParser = (groupByAddressId: string) => {
    const splitedId = groupByAddressId.split(SIMBOL)

    if (splitedId.length !== 2) throw apolloError('유효하지 않은 주소 아이디', 'INVALID_ID')

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