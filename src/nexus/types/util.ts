import { inputObjectType } from "nexus"

export const SkipTakePagination = inputObjectType({
    name: 'SkipTakePagination',
    definition(t) {
        t.nonNull.int('skip', { default: 0 })
        t.nonNull.int('take', { default: 10 })
    }
})

export const CursorTakePagination = inputObjectType({
    name: 'CursorTakePagination',
    definition(t) {
        t.nullable.int('cursor')
        t.nonNull.int('take', { default: 10 })
    }
})
