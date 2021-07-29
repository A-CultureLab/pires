import { User } from '.prisma/client'
import { Context, prisma } from '../context'
import { userAuth } from '../lib/firebase'

// TODO @ts-ignore
export const getIUser = async <B = false>(ctx: Context, ignoreError?: B): Promise<B extends true ? User | null : User> => {
    let token: any = ''
    try {
        // http
        token = ctx.expressContext.req.headers.authorization
    } catch (error) {
        try {
            // websocket
            token = ctx.expressContext.connection?.context.connectionParams.headers.authorization
        } catch (error) {

        }
    }

    if (!token) {
        // @ts-ignore
        if (ignoreError) return null
        else throw new Error('로그인이 필요한 작업입니다')
    }

    token = token.replace('Bearer ', '')


    const { uid: id } = await userAuth.verifyIdToken(token)

    // uid에 해당하는 user filed 가 없다면 유저를 생성
    const user = await prisma.user.findFirst({ where: { id } })
    // @ts-ignore
    return user
}

export default getIUser