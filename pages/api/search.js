import axios from 'axios';

// 네이버 오픈 API가 제공하는 검색 유형. apiType이 그대로 URL 경로에 들어가므로
// 허용 목록으로 제한한다.
const ALLOWED_API_TYPES = ['blog', 'news', 'book', 'cafearticle', 'kin', 'local'];

const handler = async (req, res) => {
  const { query, start = 1, display = 10, apiType = 'blog' } = req.query;

  if (!query) {
    return res.status(400).json({ message: '검색어(query)가 필요합니다.' });
  }

  if (!ALLOWED_API_TYPES.includes(apiType)) {
    return res
      .status(400)
      .json({ message: `지원하지 않는 검색 유형입니다: ${apiType}` });
  }

  if (!process.env.NAVER_CLIENT_ID || !process.env.NAVER_CLIENT_SECRET) {
    return res.status(500).json({
      message:
        'NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 환경변수가 설정되지 않았습니다.',
    });
  }

  try {
    const { data } = await axios.get(
      `https://openapi.naver.com/v1/search/${apiType}.json`,
      {
        params: { query, start, display },
        headers: {
          'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
          'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
        },
      },
    );

    return res.status(200).json(data);
  } catch (error) {
    // 에러 객체를 그대로 응답에 실으면 axios가 config.headers까지 직렬화해
    // 클라이언트 시크릿이 노출된다. 상태 코드와 메시지만 내보낸다.
    console.error(
      '네이버 검색 API 호출 실패:',
      error?.response?.status,
      error?.message,
    );
    return res
      .status(error?.response?.status ?? 500)
      .json({ message: '네이버 검색 API 호출 중 오류가 발생했습니다.' });
  }
};

export default handler;
