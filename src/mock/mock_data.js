export const mockData = {
  "categories": [
    {
      "id": "my-favorites",
      "name": "我的常用",
      "icon": "💻",
      "order": 0,
      "sites": [
        {
          "id": "site-1752649007053",
          "name": "内网导航",
          "url": "http://172.16.10.240",
          "description": "家庭内网服务导航",
          "icon": "https://blog.enianteam.com/static/upload/2023/11/27/13a590cc9c8d429b7183fa26b34552a1.png"
        },
        {
          "id": "linux-do",
          "name": "知乎",
          "url": "https://www.zhihu.com",
          "description": "有问题 就会有答案",
          "icon": "https://ts1.tc.mm.bing.net/th/id/R-C.c29e400363ed307edcfdd290ea9d70ba?rik=8Q0oMvKWZFPBZA&riu=http%3a%2f%2fwww.kuaipng.com%2fUploads%2fpic%2fw%2f2021%2f04-21%2f99522%2fwater_99522_698_698_.png&ehk=fWxpu8WEpMTRd3%2bN9SPkwQqNjiy62plPibqNO9aOCuE%3d&risl=&pid=ImgRaw&r=0"
        },
        {
          "id": "site-1752857783656",
          "name": "Linux.do",
          "url": "https://linux.do",
          "description": "吹水社区",
          "icon": "/sitelogo/linux.do.ico"
        },
        {
          "id": "site-1758865474812",
          "name": "IT Tools",
          "url": "https://tools.picshow.us:50007/",
          "description": "效率工具集",
          "icon": "https://ts2.tc.mm.bing.net/th/id/OIP-C.J3ORCq5IQgIXVs5y6CGbFQAAAA?rs=1&pid=ImgDetMain&o=7&rm=3"
        },
        {
          "id": "site-1758865567495",
          "name": "Wormhole",
          "url": "https://wormhole.app/",
          "description": "简单，私密的文件分享",
          "icon": "https://ts1.tc.mm.bing.net/th/id/OIP-C.nhcsFoctNfG1U80kfzVH_gHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
        },
        {
          "id": "site-1758865904965",
          "name": "Github Proxy",
          "url": "https://github.akams.cn/",
          "description": "Github 文件代理加速",
          "icon": "https://cdn.akams.cn/images/OcticonOctoface16.svg"
        },
        {
          "id": "site-1758866014287",
          "name": "豆包",
          "url": "https://www.doubao.com/chat/",
          "description": "AI 聊天智能对话问答助手",
          "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAMAAAC8EZcfAAAC/VBMVEUAAAD////////////////6+vv///////////////////////////////8cHyH///////////8bHSAbHSAcHiEdHyL///8aHR8ZHB8dHR0jJigYGx1SWF7///8cHiAaHB5FMi0eICP/2tAZGhxFNDA7KSX/3NJHMy4kJilGNjL818xJNS89Kyb/3tRBLikiJCf+2M0nKiwgIiVJOzg6KihFMy5EMCv/4NcWFxk3KCUtIB5CMCw/LCgXGRz1zsRPOTQ+LStHODVMODLuxrs9LClLNjH20MbzzcH/49lROzb51Mn61cvmvbH70sdTPjnpwbVXQjxNPzz91cr40cfxy8Drw7fju7D7+/sfHiDvyb3sxbk3JSHetKg+JiL408jnv7PbsaThtqpSR0Xiua4sHBnxyb70yLznt6o+MTAsLTAmIiMpFhP2zMBPQ0E1KipbRkDtvrLWrqTVqJyorK/pu63WsqlbUVFWS0r5z8PxxbhgSUQqJyhsZWXks6ZANTU5Li0tKywcFxgXDg0yJSMSCQjisKEVFRbZraAfGxySk5fFgXCcXVGusrXSmIfBjH1xbG3y8/R7dXVgVVQzHxzvwrWOjY9EKSTctqzXoZCFg4XKj3/JiHfW2tyipamJiYzPk4LtrqTbpZXEd2b29/e3vcD2vrPfrJ7uqZ3dqZl9fYBmX2Di5eb5xLqzt7ryt6xjWlrEyMuXm565gnTQo5atbV8dExLJzdG/w8fVnIyqgnlkaW+ydmhEOjpfNjBJKiX7ycDss6nOno+ASD/t7u/o6uvd4OHR0dTHlIW9fG5OLSegoKLImY2+lImKZl11T0dJQUJXMixKMSslGxr9zsS2joVtQDkzMzVXOjRlOjLkj36VaV+QVks4Oz91QzpePznMq6V9W1RPNS88Ih3npJjVuLLhm46FTkThysbHoZjbhHNWXGGopqeglpZPTlFCRkrl0s/Xw7+9pKFxdnyjZlnsnouOgH6QdnHUdWTt39yfc2rCvb3FWku6sLCljovTi3rSsbLaAAAAHXRSTlMAIN+/cBCAn+/Pf0AwkMRgj1CHIN6lsDhrEFPv55T3ZWUAAB8rSURBVHjazNfPa9JhHAfw5rTlFmSXbl+QcIltSfD1uxAlN5mBEKtBIBH9QAi8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"
        },
        {
          "id": "site-1762161052308",
          "name": "盘搜",
          "url": "https://pan.ailinux.de/",
          "description": "网盘资源 & 视频搜索工具",
          "icon": "https://docker.aityp.com/static/svg/layer.svg"
        }
      ]
    },
    {
      "id": "category-1758866319117",
      "icon": "👲​",
      "name": "AI工具",
      "order": 1,
      "sites": [
        {
          "id": "site-1758866492900",
          "name": "AI工具集",
          "url": "https://ai-bot.cn/",
          "description": "1000+AI工具集合",
          "icon": "https://ai-bot.cn/wp-content/uploads/2023/04/ai-bot-baidu-logo.png"
        },
        {
          "id": "site-1758866694800",
          "name": "KIMI",
          "url": "https://www.kimi.com/",
          "description": "月之暗面推出的AI智能助手",
          "icon": "https://statics.moonshot.cn/kimi-web-seo/assets/kimi-logo-CegIMkbU.png"
        },
        {
          "id": "site-1758866783329",
          "name": "通义",
          "url": "https://www.tongyi.com/",
          "description": "通情、达义，你的全能AI助手！",
          "icon": "https://www.aiww.com/uploadfile/2024/0522/20240522062019722.png"
        },
        {
          "id": "site-1758866846000",
          "name": "秘塔",
          "url": "https://metaso.cn/",
          "description": "秘塔AI搜索",
          "icon": "https://zhengxin-pub.cdn.bcebos.com/logopic/ae5b6588643b7e72b2c57bfe60b38ade_fullsize.jpg"
        }
      ]
    },
    {
      "id": "category-1758867334633",
      "icon": "🌐",
      "name": "新闻资讯",
      "order": 2,
      "sites": [
        {
          "id": "site-1758867471911",
          "name": "ZAKER新闻",
          "url": "http://www.myzaker.com/",
          "description": "传递价值资讯",
          "icon": "https://th.bing.com/th/id/R.689dbe92bd27e4f4bec0eaed519d93c9?rik=Pt%2baYWXDm9V7Yw&riu=http%3a%2f%2fwww.lgstatic.com%2fthumbnail_300x300%2fimage1%2fM00%2f0D%2f94%2fCgYXBlT4GNWAHKzlAAAqz31ocXY814.png&ehk=N4o8PTcLZrqskr0ZuAtgVD4MUXAeMoHSsTaV5zGh7pI%3d&risl=&pid=ImgRaw&r=0"
        },
        {
          "id": "site-1758867867738",
          "name": "少数派",
          "url": "https://sspai.com/",
          "description": "高效工作 品质生活",
          "icon": "https://huashuimoyu.com/image/thirdlogo/sspai.png"
        },
        {
          "id": "site-1758867947015",
          "name": "果壳剥壳",
          "url": "https://www.ghxi.com/",
          "description": "互联网的净土",
          "icon": "https://th.bing.com/th/id/R.00f8780f09d5d13627588fd793c5d613?rik=5acBgriVQjB%2fZg&riu=http%3a%2f%2finews.gtimg.com%2fnewsapp_ls%2f0%2f12772709927_200200%2f0&ehk=5yLTGyCMCgB41eISlVzgRRA%2b6PG6MEPaJ8Loz76w6f8%3d&risl=&pid=ImgRaw&r=0"
        },
        {
          "id": "site-1758865655456",
          "name": "NewsNow",
          "url": "https://news.868767.xyz/",
          "description": "新闻聚合站",
          "icon": "https://matthew.kr/wp-content/uploads/2014/07/NOW_News_Logo.png"
        }
      ]
    }
  ],
  "title": "酷猫导航"
}
