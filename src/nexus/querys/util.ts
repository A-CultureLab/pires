import axios from "axios";
import { nanoid } from "nanoid";
import { nonNull, objectType, queryField, stringArg } from "nexus"

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

        const certificationsInfo = getCertifications.data.response;

        return {
            uniqueKey: certificationsInfo.unique_key === '55dp0SBnd/4/g/eZi5GbE7SIJiQZNcDKqagvOQzlPsUBof6e7+Q5fecNFSD4H0iAnmBfzsfLsWAM47fpdhn0tQ==' ? nanoid() : certificationsInfo.unique_key, // white list
            name: certificationsInfo.name,
            birth: new Date(certificationsInfo.birth * 1000),
            gender: certificationsInfo.gender,
        }
    }
}))