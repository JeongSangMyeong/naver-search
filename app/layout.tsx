import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | 네이버 검색',
    default: '네이버 검색',
  },
  description:
    '네이버 오픈 API를 서버 라우트로 프록시해 블로그·뉴스·책·카페·지식인·지역을 한 화면에서 검색합니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
