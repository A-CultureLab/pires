import axios from "axios";
import dayjs from "dayjs";
import { Router } from "express";
import { prisma } from "../context";
import { NEWS_CRAWLING_KEYWORDS } from "../values";
import ogs from 'open-graph-scraper'
import parseEntities from 'parse-entities';

const router = Router()

// cron 하루주기
router.post('/crawling', async (req, res, next) => {
    try {
        for (const keyword of NEWS_CRAWLING_KEYWORDS) {
            try {
                // 키워드를 통해 검색
                const { data } = await axios.get('https://openapi.naver.com/v1/search/news.json', {
                    params: {
                        query: keyword,
                        sort: 'sim',
                        display: 100
                    },
                    headers: {
                        'X-Naver-Client-Id': process.env['X-Naver-Client-Id'],
                        'X-Naver-Client-Secret': process.env['X-Naver-Client-Secret']
                    }
                })
                // 검색된 데이터 가공
                for (const item of data.items) {
                    try {
                        // 썸네일용 open graphic 이미지 가져오기
                        const { result } = await ogs({ url: item.link })
                        if (!result.success) throw new Error
                        // @ts-ignore
                        if (!result.ogImage?.url) throw new Error
                        // DB에 생성
                        const news = await prisma.news.create({
                            data: {
                                // @ts-ignore
                                image: result.ogImage.url,
                                createdAt: dayjs(item.pubDate).toDate(),
                                title: parseEntities(item.title.replace(/<b>/gi, '').replace(/<\/b>/gi, '')),
                                content: parseEntities(item.description.replace(/<b>/gi, '').replace(/<\/b>/gi, '')),
                                link: item.link
                            }
                        })
                        // console.log(news)
                    } catch (error) { /* 링크 중복 오류  로그수집 X */ }
                }
            } catch (error) {
                console.error('Naver open api error')
            }
        }
        return res.send()
    } catch (error) {
        next(error)
    }
})

export default router