import axios from "axios";
import compareVersions from "compare-versions";
import { nanoid } from "nanoid";
import { nonNull, objectType, queryField, stringArg } from "nexus"
import option from '../../../option.json'
import apolloError from "../../utils/apolloError";
import { USER_CERTIFICATION_WHITE_LIST } from "../../values";


export const UserCertificationInfo = objectType({
    name: 'UserCertificationInfo',
    definition: (t) => {
        t.nonNull.string('uniqueKey')
        t.nonNull.string('name')
        t.nonNull.field('gender', { type: 'Gender' })
        t.nonNull.field('birth', { type: 'DateTime' })
    }
})

export const userCertificationInfo = queryField(t => t.nonNull.field('userCertificationInfo', {
    type: UserCertificationInfo,
    args: {
        imp_uid: nonNull(stringArg())
    },
    resolve: async (_, { imp_uid }, ctx) => {
        const getToken = await axios({
            url: "https://api.iamport.kr/users/getToken",
            method: "post", // POST method
            headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
            data: {
                imp_key: process.env.IMP_KEY, // REST API키
                imp_secret: process.env.IMP_SECRET // REST API Secret
            }
        })
        const { access_token } = getToken.data.response; // 인증 토큰

        // imp_uid로 인증 정보 조회
        const getCertifications = await axios({
            url: `https://api.iamport.kr/certifications/${imp_uid}`, // imp_uid 전달
            method: "get", // GET method
            headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
        });

        const certificationsInfo = getCertifications.data.response
        // console.log(certificationsInfo)
        return {
            uniqueKey: USER_CERTIFICATION_WHITE_LIST.includes(certificationsInfo.unique_key) ? nanoid() : certificationsInfo.unique_key, // white list
            name: certificationsInfo.name,
            birth: new Date(certificationsInfo.birth * 1000),
            gender: certificationsInfo.gender,
        }
    }
}))

export const isUpdateRequire = queryField(t => t.nonNull.boolean('isUpdateRequire', {
    args: {
        version: nonNull(stringArg())
    },
    resolve: (_, { version }, ctx) => {
        return compareVersions.compare(option.appTargetVersion, version, "<") || compareVersions.compare(option.appMinimumVersion, version, '>')
    }
}))

export const InstagramIdToProfileObject = objectType({
    name: 'InstagramIdToProfileObject',
    definition: (t) => {
        t.nonNull.string('name')
        t.nonNull.string('image')
    }
})