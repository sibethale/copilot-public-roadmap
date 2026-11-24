"use strict";

const allowedHosts = new Set([
  "www.microsoft.com", "techcommunity.microsoft.com", "blogs.microsoft.com",
  "devblogs.microsoft.com", "msmessagecenter.com", "news.microsoft.com",
  "cdn-dynmedia-1.microsoft.com", "ignite.microsoft.com", "www.youtube.com",
]);
const publicDocumentUrl = "https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/bade/documents/products-and-services/en-us/ai/CopilotCreditsGuide.pdf";
const publicSessionUrls = new Set([
  "https://ignite.microsoft.com/en-US/sessions/1787856604402001Ec2D-1791588173232001Cx8h",
  "https://ignite.microsoft.com/en-US/sessions/BRK206",
  "https://ignite.microsoft.com/en-US/sessions/BRK209",
  "https://ignite.microsoft.com/en-US/sessions/BRK211",
  "https://ignite.microsoft.com/en-US/sessions/BRK213",
  "https://ignite.microsoft.com/en-US/sessions/BRK215",
  "https://ignite.microsoft.com/en-US/sessions/BRK217",
  "https://ignite.microsoft.com/en-US/sessions/BRK219",
  "https://ignite.microsoft.com/en-US/sessions/BRK220",
  "https://ignite.microsoft.com/en-US/sessions/BRK221",
  "https://ignite.microsoft.com/en-US/sessions/BRK227",
  "https://ignite.microsoft.com/en-US/sessions/BRK229",
  "https://ignite.microsoft.com/en-US/sessions/BRK237",
  "https://ignite.microsoft.com/en-US/sessions/BRK240",
  "https://ignite.microsoft.com/en-US/sessions/BRK243",
  "https://ignite.microsoft.com/en-US/sessions/BRK245",
  "https://ignite.microsoft.com/en-US/sessions/BRK249",
  "https://ignite.microsoft.com/en-US/sessions/BRK253",
  "https://ignite.microsoft.com/en-US/sessions/BRK261",
  "https://ignite.microsoft.com/en-US/sessions/BRK264",
  "https://ignite.microsoft.com/en-US/sessions/BRK266",
  "https://ignite.microsoft.com/en-US/sessions/BRK269",
  "https://ignite.microsoft.com/en-US/sessions/BRK272",
  "https://ignite.microsoft.com/en-US/sessions/BRK277",
  "https://ignite.microsoft.com/en-US/sessions/BRK280",
  "https://ignite.microsoft.com/en-US/sessions/BRK281",
  "https://ignite.microsoft.com/en-US/sessions/BRK285",
  "https://ignite.microsoft.com/en-US/sessions/BRK308",
  "https://ignite.microsoft.com/en-US/sessions/BRK309",
  "https://ignite.microsoft.com/en-US/sessions/BRK310",
  "https://ignite.microsoft.com/en-US/sessions/BRK311",
  "https://ignite.microsoft.com/en-US/sessions/BRK312",
  "https://ignite.microsoft.com/en-US/sessions/BRK318",
  "https://ignite.microsoft.com/en-US/sessions/BRK319",
  "https://ignite.microsoft.com/en-US/sessions/BRK320",
  "https://ignite.microsoft.com/en-US/sessions/BRK321",
  "https://ignite.microsoft.com/en-US/sessions/BRK322",
  "https://ignite.microsoft.com/en-US/sessions/BRK323",
  "https://ignite.microsoft.com/en-US/sessions/BRK325",
  "https://ignite.microsoft.com/en-US/sessions/BRK326",
  "https://ignite.microsoft.com/en-US/sessions/BRK327",
  "https://ignite.microsoft.com/en-US/sessions/BRK328",
  "https://ignite.microsoft.com/en-US/sessions/BRK329",
  "https://ignite.microsoft.com/en-US/sessions/BRK330",
  "https://ignite.microsoft.com/en-US/sessions/BRK331",
  "https://ignite.microsoft.com/en-US/sessions/BRK332",
  "https://ignite.microsoft.com/en-US/sessions/BRK333",
  "https://ignite.microsoft.com/en-US/sessions/BRK335",
  "https://ignite.microsoft.com/en-US/sessions/BRK336",
  "https://ignite.microsoft.com/en-US/sessions/BRK337",
  "https://ignite.microsoft.com/en-US/sessions/BRK340",
  "https://ignite.microsoft.com/en-US/sessions/BRK343",
  "https://ignite.microsoft.com/en-US/sessions/BRK344",
  "https://ignite.microsoft.com/en-US/sessions/BRK345",
  "https://ignite.microsoft.com/en-US/sessions/BRK346",
  "https://ignite.microsoft.com/en-US/sessions/BRK347",
  "https://ignite.microsoft.com/en-US/sessions/BRK388",
  "https://ignite.microsoft.com/en-US/sessions/BRK389",
  "https://ignite.microsoft.com/en-US/sessions/BRK404",
  "https://ignite.microsoft.com/en-US/sessions/BRK405",
  "https://ignite.microsoft.com/en-US/sessions/BRK406",
  "https://ignite.microsoft.com/en-US/sessions/BRK407",
  "https://ignite.microsoft.com/en-US/sessions/BRK409",
  "https://ignite.microsoft.com/en-US/sessions/BRK410",
  "https://ignite.microsoft.com/en-US/sessions/BRK411",
  "https://ignite.microsoft.com/en-US/sessions/BRK412",
  "https://ignite.microsoft.com/en-US/sessions/BRK433",
  "https://ignite.microsoft.com/en-US/sessions/BRK434",
  "https://ignite.microsoft.com/en-US/sessions/BRK448",
  "https://ignite.microsoft.com/en-US/sessions/BRK450",
  "https://ignite.microsoft.com/en-US/sessions/BRK452",
  "https://ignite.microsoft.com/en-US/sessions/BRK453",
  "https://ignite.microsoft.com/en-US/sessions/BRK455",
  "https://ignite.microsoft.com/en-US/sessions/BRK456",
  "https://ignite.microsoft.com/en-US/sessions/BRK458",
  "https://ignite.microsoft.com/en-US/sessions/BRK459",
  "https://ignite.microsoft.com/en-US/sessions/BRK460",
  "https://ignite.microsoft.com/en-US/sessions/BRK461",
  "https://ignite.microsoft.com/en-US/sessions/BRK462",
  "https://ignite.microsoft.com/en-US/sessions/BRK464",
  "https://ignite.microsoft.com/en-US/sessions/BRK465",
  "https://ignite.microsoft.com/en-US/sessions/BRK466",
  "https://ignite.microsoft.com/en-US/sessions/BRK470",
  "https://ignite.microsoft.com/en-US/sessions/BRK471",
  "https://ignite.microsoft.com/en-US/sessions/BRK472",
  "https://ignite.microsoft.com/en-US/sessions/BRK473",
  "https://ignite.microsoft.com/en-US/sessions/BRK474",
  "https://ignite.microsoft.com/en-US/sessions/BRK475",
  "https://ignite.microsoft.com/en-US/sessions/BRK476",
  "https://ignite.microsoft.com/en-US/sessions/BRK480",
  "https://ignite.microsoft.com/en-US/sessions/BRK481",
  "https://ignite.microsoft.com/en-US/sessions/BRK482",
  "https://ignite.microsoft.com/en-US/sessions/BRK485",
  "https://ignite.microsoft.com/en-US/sessions/BRK490",
  "https://ignite.microsoft.com/en-US/sessions/BRK491",
  "https://ignite.microsoft.com/en-US/sessions/BRK492",
  "https://ignite.microsoft.com/en-US/sessions/BRK494",
  "https://ignite.microsoft.com/en-US/sessions/BRK495",
  "https://ignite.microsoft.com/en-US/sessions/BRK496",
  "https://ignite.microsoft.com/en-US/sessions/BRK497",
  "https://ignite.microsoft.com/en-US/sessions/BRK498",
  "https://ignite.microsoft.com/en-US/sessions/BRK499",
  "https://ignite.microsoft.com/en-US/sessions/BRK500",
  "https://ignite.microsoft.com/en-US/sessions/BRK501",
  "https://ignite.microsoft.com/en-US/sessions/BRK502",
  "https://ignite.microsoft.com/en-US/sessions/BRK503",
  "https://ignite.microsoft.com/en-US/sessions/BRK504",
  "https://ignite.microsoft.com/en-US/sessions/BRK505",
  "https://ignite.microsoft.com/en-US/sessions/BRK507",
  "https://ignite.microsoft.com/en-US/sessions/BRK514",
  "https://ignite.microsoft.com/en-US/sessions/BRK519",
  "https://ignite.microsoft.com/en-US/sessions/BRK520",
  "https://ignite.microsoft.com/en-US/sessions/BRK521",
  "https://ignite.microsoft.com/en-US/sessions/BRK523",
  "https://ignite.microsoft.com/en-US/sessions/BRK524",
  "https://ignite.microsoft.com/en-US/sessions/BRK525",
  "https://ignite.microsoft.com/en-US/sessions/BRK529",
  "https://ignite.microsoft.com/en-US/sessions/BRK531",
  "https://ignite.microsoft.com/en-US/sessions/BRK532",
  "https://ignite.microsoft.com/en-US/sessions/BRK534",
  "https://ignite.microsoft.com/en-US/sessions/BRK535",
  "https://ignite.microsoft.com/en-US/sessions/BRK537",
  "https://ignite.microsoft.com/en-US/sessions/BRK538",
  "https://ignite.microsoft.com/en-US/sessions/BRK543",
  "https://ignite.microsoft.com/en-US/sessions/BRK546",
  "https://ignite.microsoft.com/en-US/sessions/BRK547",
  "https://ignite.microsoft.com/en-US/sessions/BRK548",
  "https://ignite.microsoft.com/en-US/sessions/BRK551",
  "https://ignite.microsoft.com/en-US/sessions/BRK555",
  "https://ignite.microsoft.com/en-US/sessions/BRK557",
  "https://ignite.microsoft.com/en-US/sessions/BRK559",
  "https://ignite.microsoft.com/en-US/sessions/BRK560",
  "https://ignite.microsoft.com/en-US/sessions/BRK570",
  "https://ignite.microsoft.com/en-US/sessions/BRK571",
  "https://ignite.microsoft.com/en-US/sessions/BRK581",
  "https://ignite.microsoft.com/en-US/sessions/BRKSP601",
  "https://ignite.microsoft.com/en-US/sessions/BRKSP608",
  "https://ignite.microsoft.com/en-US/sessions/BRKSP621",
  "https://ignite.microsoft.com/en-US/sessions/BRKSP626",
  "https://ignite.microsoft.com/en-US/sessions/BRKSP630",
  "https://ignite.microsoft.com/en-US/sessions/BRKSP634",
  "https://ignite.microsoft.com/en-US/sessions/KEY01",
  "https://ignite.microsoft.com/en-US/sessions/INV643",
  "https://ignite.microsoft.com/en-US/sessions/THR1006",
  "https://ignite.microsoft.com/en-US/sessions/THR1012",
  "https://ignite.microsoft.com/en-US/sessions/THR1014",
  "https://ignite.microsoft.com/en-US/sessions/THR1015",
  "https://ignite.microsoft.com/en-US/sessions/THR1021",
  "https://ignite.microsoft.com/en-US/sessions/THR1024",
  "https://ignite.microsoft.com/en-US/sessions/THR1025",
  "https://ignite.microsoft.com/en-US/sessions/THR1031",
  "https://ignite.microsoft.com/en-US/sessions/THR1046",
  "https://ignite.microsoft.com/en-US/sessions/THR1048",
  "https://ignite.microsoft.com/en-US/sessions/THR1049",
  "https://ignite.microsoft.com/en-US/sessions/THR1803",
  "https://ignite.microsoft.com/en-US/sessions/THR851",
  "https://ignite.microsoft.com/en-US/sessions/THR855",
  "https://ignite.microsoft.com/en-US/sessions/THR857",
  "https://ignite.microsoft.com/en-US/sessions/THR859",
  "https://ignite.microsoft.com/en-US/sessions/THR877",
  "https://ignite.microsoft.com/en-US/sessions/THR882",
  "https://ignite.microsoft.com/en-US/sessions/THR888",
  "https://ignite.microsoft.com/en-US/sessions/THR891",
  "https://ignite.microsoft.com/en-US/sessions/THR892",
  "https://ignite.microsoft.com/en-US/sessions/THR895",
  "https://ignite.microsoft.com/en-US/sessions/THR897",
  "https://ignite.microsoft.com/en-US/sessions/THR899",
  "https://ignite.microsoft.com/en-US/sessions/THR902",
  "https://ignite.microsoft.com/en-US/sessions/THR905",
  "https://ignite.microsoft.com/en-US/sessions/THR907",
  "https://ignite.microsoft.com/en-US/sessions/THR908",
  "https://ignite.microsoft.com/en-US/sessions/THR911",
  "https://ignite.microsoft.com/en-US/sessions/THR923",
  "https://ignite.microsoft.com/en-US/sessions/THR924",
  "https://ignite.microsoft.com/en-US/sessions/THR929",
  "https://ignite.microsoft.com/en-US/sessions/THR932",
  "https://ignite.microsoft.com/en-US/sessions/THR934",
  "https://ignite.microsoft.com/en-US/sessions/THR944",
  "https://ignite.microsoft.com/en-US/sessions/THR945",
  "https://ignite.microsoft.com/en-US/sessions/THR946",
  "https://ignite.microsoft.com/en-US/sessions/THR947",
  "https://ignite.microsoft.com/en-US/sessions/THR948",
  "https://ignite.microsoft.com/en-US/sessions/THR949",
  "https://ignite.microsoft.com/en-US/sessions/THR950",
  "https://ignite.microsoft.com/en-US/sessions/THR951",
  "https://ignite.microsoft.com/en-US/sessions/THR952",
  "https://ignite.microsoft.com/en-US/sessions/THR954",
  "https://ignite.microsoft.com/en-US/sessions/THR955",
  "https://ignite.microsoft.com/en-US/sessions/THR956",
  "https://ignite.microsoft.com/en-US/sessions/THR957",
  "https://ignite.microsoft.com/en-US/sessions/THR958",
  "https://ignite.microsoft.com/en-US/sessions/THR959",
  "https://ignite.microsoft.com/en-US/sessions/THR961",
  "https://ignite.microsoft.com/en-US/sessions/THR963",
  "https://ignite.microsoft.com/en-US/sessions/THR964",
  "https://ignite.microsoft.com/en-US/sessions/THR966",
  "https://ignite.microsoft.com/en-US/sessions/THR967",
  "https://ignite.microsoft.com/en-US/sessions/THR968",
  "https://ignite.microsoft.com/en-US/sessions/THR969",
  "https://ignite.microsoft.com/en-US/sessions/THR971",
  "https://ignite.microsoft.com/en-US/sessions/THR973",
  "https://ignite.microsoft.com/en-US/sessions/THR974",
  "https://ignite.microsoft.com/en-US/sessions/THR977",
  "https://ignite.microsoft.com/en-US/sessions/THR978",
  "https://ignite.microsoft.com/en-US/sessions/THR981",
  "https://ignite.microsoft.com/en-US/sessions/THR982",
  "https://ignite.microsoft.com/en-US/sessions/THR985",
  "https://ignite.microsoft.com/en-US/sessions/THR992",
  "https://ignite.microsoft.com/en-US/sessions/THR994",
  "https://ignite.microsoft.com/en-US/sessions/THR996",
  "https://ignite.microsoft.com/en-US/sessions/THR998",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1050",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1063",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1064",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1065",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1066",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1067",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1069",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1070",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1071",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1074",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1075",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1077",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1078",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1082",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1085",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1089",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1094",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1102",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1105",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1108",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1115",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1116",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1117",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1120",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1125",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1133",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1137",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1138",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1141",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1143",
  "https://ignite.microsoft.com/en-US/sessions/THRSP1157"
]);
const publicVideoUrls = new Set([
  "https://www.youtube.com/watch?v=3q1hkvz-Jhg",
  "https://www.youtube.com/watch?v=9M9qXO54lYo",
  "https://www.youtube.com/watch?v=RE-3yKhAJy8",
  "https://www.youtube.com/watch?v=GeheBWiNWfo",
  "https://www.youtube.com/watch?v=lVrLm87w_OE",
  "https://www.youtube.com/watch?v=byaL2mfsTSs",
  "https://www.youtube.com/watch?v=fTxiek68gUk",
  "https://www.youtube.com/watch?v=cLGM_euqANw",
  "https://www.youtube.com/watch?v=pjYeRHkl9Yw",
  "https://www.youtube.com/watch?v=WXqTRsaqtWI",
  "https://www.youtube.com/watch?v=Ds2Ihxay7T4",
  "https://www.youtube.com/watch?v=dNT2ZX15fCg",
  "https://www.youtube.com/watch?v=_QHbGyIYiH0",
  "https://www.youtube.com/watch?v=br4BzFxjMAY",
  "https://www.youtube.com/watch?v=7XIe7PRR4fc",
  "https://www.youtube.com/watch?v=Or-5ihGeXkQ",
  "https://www.youtube.com/watch?v=8POVUHWamEQ",
  "https://www.youtube.com/watch?v=gP-LvaNUBWQ",
  "https://www.youtube.com/watch?v=14DpRGE6wqA",
  "https://www.youtube.com/watch?v=ICjBg7vcIBE",
  "https://www.youtube.com/watch?v=O5elv3UmUOo",
  "https://www.youtube.com/watch?v=CZlUtIxGJkg",
  "https://www.youtube.com/watch?v=Ztn208_5jpI",
  "https://www.youtube.com/watch?v=1kpeIbdAfoQ",
  "https://www.youtube.com/watch?v=kKGX6P5VfZI",
  "https://www.youtube.com/watch?v=gocKE-Nqt9w",
  "https://www.youtube.com/watch?v=QE47gfJrl7k",
  "https://www.youtube.com/watch?v=yz-KR9kR0VY",
  "https://www.youtube.com/watch?v=eVo9ZpSFq-o",
  "https://www.youtube.com/watch?v=SAg2w_LxGEQ",
  "https://www.youtube.com/watch?v=ewZkp-Lh7i4",
  "https://www.youtube.com/watch?v=FJ0uMegdm3I",
  "https://www.youtube.com/watch?v=tqkkDA5FYwI",
  "https://www.youtube.com/watch?v=CxI_-rWqBTE",
  "https://www.youtube.com/watch?v=4vj7vKr7GRU",
  "https://www.youtube.com/watch?v=uBBNR3CyltE",
  "https://www.youtube.com/watch?v=Ymdv-OXGcVI",
  "https://www.youtube.com/watch?v=uryhoPb2R1I",
  "https://www.youtube.com/watch?v=hS-sSjcSQag",
  "https://www.youtube.com/watch?v=8_ad8PcB8EY",
  "https://www.youtube.com/watch?v=mONiQX0HCas",
  "https://www.youtube.com/watch?v=Wp3TjbeYc6c",
  "https://www.youtube.com/watch?v=oclJ0WzN69Q",
  "https://www.youtube.com/watch?v=JaVtPH747V8",
  "https://www.youtube.com/watch?v=VQfSTXngCaM",
  "https://www.youtube.com/watch?v=Fa4lt1lEmVE",
  "https://www.youtube.com/watch?v=eT2L6RQtoW8",
  "https://www.youtube.com/watch?v=2yw316sqlKM",
  "https://www.youtube.com/watch?v=0hBjLjXMfOU",
  "https://www.youtube.com/watch?v=UZbU8Aus0WQ",
  "https://www.youtube.com/watch?v=7kRTopS4Xfg",
  "https://www.youtube.com/watch?v=n1Mwe3UbPHY",
  "https://www.youtube.com/watch?v=nRth-YJsIO4",
  "https://www.youtube.com/watch?v=Med1A1qbAhs",
  "https://www.youtube.com/watch?v=XhDqfjq4ha8",
  "https://www.youtube.com/watch?v=C39DKJ6ybgk",
  "https://www.youtube.com/watch?v=-RhUWaygkis",
  "https://www.youtube.com/watch?v=bcIz5XFDJFo",
  "https://www.youtube.com/watch?v=D7tuX_kMWO8",
  "https://www.youtube.com/watch?v=I4RmpEAA_bE",
  "https://www.youtube.com/watch?v=N12e3ITrZuo",
  "https://www.youtube.com/watch?v=eKznflnKomA",
  "https://www.youtube.com/watch?v=DsJUyF4Ep48",
  "https://www.youtube.com/watch?v=d-_OIhX7920",
  "https://www.youtube.com/watch?v=bOVIztVIPxk",
  "https://www.youtube.com/watch?v=VIW2folj5zA",
  "https://www.youtube.com/watch?v=ADjH1TTLx8w",
  "https://www.youtube.com/watch?v=01UqBkgi99M",
  "https://www.youtube.com/watch?v=JN4bPm611uY",
  "https://www.youtube.com/watch?v=gDnXp-BaNAw",
  "https://www.youtube.com/watch?v=wy8gMMhhIOY",
  "https://www.youtube.com/watch?v=J9BOltZBo_0",
  "https://www.youtube.com/watch?v=wKKWSpcHQZk",
  "https://www.youtube.com/watch?v=hATu85rJVx8",
  "https://www.youtube.com/watch?v=dZcwa0zsXIc",
  "https://www.youtube.com/watch?v=OMjjc4XNp58",
  "https://www.youtube.com/watch?v=ieGAbTRnpv4",
  "https://www.youtube.com/watch?v=N6ghUk5TvPc",
  "https://www.youtube.com/watch?v=8o-9GuUck90",
  "https://www.youtube.com/watch?v=1WvPUwNxeqA",
  "https://www.youtube.com/watch?v=VO0pjIubjXE",
  "https://www.youtube.com/watch?v=13TfqEcB3dw",
  "https://www.youtube.com/watch?v=gJu4UeTkBq8",
  "https://www.youtube.com/watch?v=EWHW_2aS_uE",
  "https://www.youtube.com/watch?v=ldVwA2dbw0s",
  "https://www.youtube.com/watch?v=w6Gq-xqUFGE",
  "https://www.youtube.com/watch?v=w8r7M22Jyo4",
  "https://www.youtube.com/watch?v=LzxM3cdHGVA",
  "https://www.youtube.com/watch?v=0FDpgxK5mXM",
  "https://www.youtube.com/watch?v=wyvBqcQ7VkY",
  "https://www.youtube.com/watch?v=mPzE1R62rzk",
  "https://www.youtube.com/watch?v=Z0Qr_Aohphg",
  "https://www.youtube.com/watch?v=qH7moM_fCOg",
  "https://www.youtube.com/watch?v=gu5x_W2TZz8",
  "https://www.youtube.com/watch?v=hzgbmOYxVJY",
  "https://www.youtube.com/watch?v=GX3YHt0aZO4",
  "https://www.youtube.com/watch?v=i57CkO3Wl7g",
  "https://www.youtube.com/watch?v=w3fz88c4dUc",
  "https://www.youtube.com/watch?v=SAeZ2t8-5dI",
  "https://www.youtube.com/watch?v=7g-61yIkMgI",
  "https://www.youtube.com/watch?v=F3g1SgDffck",
  "https://www.youtube.com/watch?v=0DvuqQR3Pfs",
  "https://www.youtube.com/watch?v=cx7TOuZGjvo",
  "https://www.youtube.com/watch?v=iNit0a54LZM",
  "https://www.youtube.com/watch?v=Hly9PSLplL4",
  "https://www.youtube.com/watch?v=3l9eE6liU5Y",
  "https://www.youtube.com/watch?v=2DQ9Bg-D7us",
  "https://www.youtube.com/watch?v=Km14Whr8TyM",
  "https://www.youtube.com/watch?v=KtkNLj_a0H4",
  "https://www.youtube.com/watch?v=jD6d5l3Gwb4",
  "https://www.youtube.com/watch?v=ypxEcYFkL9Y",
  "https://www.youtube.com/watch?v=CQ-LMBZElhc",
  "https://www.youtube.com/watch?v=FYxjzD-HY0U",
  "https://www.youtube.com/watch?v=ZZuiYJ2499I",
  "https://www.youtube.com/watch?v=qyc1qpjuDqU",
  "https://www.youtube.com/watch?v=xovJYj-tGnQ",
  "https://www.youtube.com/watch?v=u23DGLx0Mxs",
  "https://www.youtube.com/watch?v=0yWV98sMUXg",
  "https://www.youtube.com/watch?v=mzQiTgfOabc",
  "https://www.youtube.com/watch?v=Q_9HFjAj0Ww",
  "https://www.youtube.com/watch?v=5ab_5toumWU",
  "https://www.youtube.com/watch?v=zpt5QKdIfdI",
  "https://www.youtube.com/watch?v=OiO5BCOouzA",
  "https://www.youtube.com/watch?v=Ia1KSxhAGn8",
  "https://www.youtube.com/watch?v=cFAuSQssEq8",
  "https://www.youtube.com/watch?v=Lw4aIE8B9o4",
  "https://www.youtube.com/watch?v=O24JDchp-L4",
  "https://www.youtube.com/watch?v=KBKMHowkRmE",
  "https://www.youtube.com/watch?v=BbPRdQK9CDw",
  "https://www.youtube.com/watch?v=WjzgxTtdfno",
  "https://www.youtube.com/watch?v=TPCNhA_Jy6M",
  "https://www.youtube.com/watch?v=g2wSshatJ90",
  "https://www.youtube.com/watch?v=h8PfA9KQRiM",
  "https://www.youtube.com/watch?v=ZR4v1c4CClc",
  "https://www.youtube.com/watch?v=I27UYrukuAw",
  "https://www.youtube.com/watch?v=5JovyQ33uCY",
  "https://www.youtube.com/watch?v=4fEzht3UX1E",
  "https://www.youtube.com/watch?v=rZQ9xkbl11Q",
  "https://www.youtube.com/watch?v=nAMd4QI3nfA",
  "https://www.youtube.com/watch?v=mVxT5T-Jl7Q",
  "https://www.youtube.com/watch?v=jDMNnrUGxyg",
  "https://www.youtube.com/watch?v=EDVi4DnNBno",
  "https://www.youtube.com/watch?v=7IK_71kb18s",
  "https://www.youtube.com/watch?v=Vs0JP45MnFA",
  "https://www.youtube.com/watch?v=7zc6D2SZOo8",
  "https://www.youtube.com/watch?v=naHUOwiVMEc",
  "https://www.youtube.com/watch?v=MSP-EoR_GoQ",
  "https://www.youtube.com/watch?v=LNGliOD6LFk",
  "https://www.youtube.com/watch?v=dMJaAPR7UHg",
  "https://www.youtube.com/watch?v=lWSaJ_BOz4I",
  "https://www.youtube.com/watch?v=wPHFEImj-D0",
  "https://www.youtube.com/watch?v=Ym2ESu2-KQM",
  "https://www.youtube.com/watch?v=ip7Nx8MLxzs",
  "https://www.youtube.com/watch?v=R9U0yn8s6Do",
  "https://www.youtube.com/watch?v=bWa4eDSmwNg",
  "https://www.youtube.com/watch?v=8B_9dERCvz0",
  "https://www.youtube.com/watch?v=HCahGhu2k5U",
  "https://www.youtube.com/watch?v=g0lqAP2S2mI",
  "https://www.youtube.com/watch?v=xsNB-XTGvME",
  "https://www.youtube.com/watch?v=xkhd4M68WyM",
  "https://www.youtube.com/watch?v=RX-ZLBNpz4E",
  "https://www.youtube.com/watch?v=CYhy09vFmxo",
  "https://www.youtube.com/watch?v=nAEMaziozQ4",
  "https://www.youtube.com/watch?v=BTDET2w52dM",
  "https://www.youtube.com/watch?v=cp07kYG9EMI",
  "https://www.youtube.com/watch?v=AKM9dZmbUww",
  "https://www.youtube.com/watch?v=R1piWTgycOY",
  "https://www.youtube.com/watch?v=chL3ot7jq1o",
  "https://www.youtube.com/watch?v=dGg6Wi_MJuA",
  "https://www.youtube.com/watch?v=MB85Lyl2wZE",
  "https://www.youtube.com/watch?v=Ow9v_JoUVHo",
  "https://www.youtube.com/watch?v=CbC8WkYdKsg",
  "https://www.youtube.com/watch?v=tUI0CNM3aUU",
  "https://www.youtube.com/watch?v=1-abSbeu8lw",
  "https://www.youtube.com/watch?v=-2a4MCyEKV8",
  "https://www.youtube.com/watch?v=VWw66NWGBCI",
  "https://www.youtube.com/watch?v=SKXlFgAr8kM",
  "https://www.youtube.com/watch?v=oC1jf-0Jq8A",
  "https://www.youtube.com/watch?v=2zraWYqzKtg",
  "https://www.youtube.com/watch?v=oTVvFqKZOWI",
  "https://www.youtube.com/watch?v=8laK89qrTC8",
  "https://www.youtube.com/watch?v=LunB4ximhQ4",
  "https://www.youtube.com/watch?v=zFzu50x3ZFs",
  "https://www.youtube.com/watch?v=Ct4pYdNWTzE",
  "https://www.youtube.com/watch?v=lpZCLh0baas",
  "https://www.youtube.com/watch?v=YY7thCGZXY4",
  "https://www.youtube.com/watch?v=1vEbP5FSztY",
  "https://www.youtube.com/watch?v=1fm0AHg7Jgs",
  "https://www.youtube.com/watch?v=deNpTk93qgA",
  "https://www.youtube.com/watch?v=PoNsZqbR2l0",
  "https://www.youtube.com/watch?v=epFSIpjLxRU",
  "https://www.youtube.com/watch?v=NB208nN-9Es",
  "https://www.youtube.com/watch?v=DLIcYB-SfGs",
  "https://www.youtube.com/watch?v=-JUuQfyfMxk",
  "https://www.youtube.com/watch?v=CK-ePdbtvq0",
  "https://www.youtube.com/watch?v=YImxqMNAndU",
  "https://www.youtube.com/watch?v=g_KTnZHEQj8",
  "https://www.youtube.com/watch?v=vOpXMGsoe94",
  "https://www.youtube.com/watch?v=7MePOSq6ARw",
  "https://www.youtube.com/watch?v=aNeLiNEA82Q",
  "https://www.youtube.com/watch?v=8Z0gqg-B350",
  "https://www.youtube.com/watch?v=JZK3iDzDbnA",
  "https://www.youtube.com/watch?v=9ehGs9eeUNY",
  "https://www.youtube.com/watch?v=jcdAPqPLiIQ",
  "https://www.youtube.com/watch?v=K_D9hJY03fk",
  "https://www.youtube.com/watch?v=8Vcp6w8C8NE",
  "https://www.youtube.com/watch?v=9TIM4NhQFwI",
  "https://www.youtube.com/watch?v=_zRudZ4vE9g",
  "https://www.youtube.com/watch?v=3JJZQm81HW4",
  "https://www.youtube.com/watch?v=bxYs4BKS58o",
  "https://www.youtube.com/watch?v=j4rWCdM5k10",
  "https://www.youtube.com/watch?v=nPdOIKjyVPc",
  "https://www.youtube.com/watch?v=csjpV0geWDA",
  "https://www.youtube.com/watch?v=z-87eAyqcdM",
  "https://www.youtube.com/watch?v=CYUJnurFilg",
  "https://www.youtube.com/watch?v=gOJhj3uUf-Q",
  "https://www.youtube.com/watch?v=WgWaYYl1tNc",
  "https://www.youtube.com/watch?v=AgOkQFPUBVI",
  "https://www.youtube.com/watch?v=L6PvMh5XHcE",
  "https://www.youtube.com/watch?v=WLruXaoUkZo",
  "https://www.youtube.com/watch?v=Pqj7TI9lOYo",
  "https://www.youtube.com/watch?v=UW4knCqhD2g",
  "https://www.youtube.com/watch?v=HFOBe1pw4as",
  "https://www.youtube.com/watch?v=yjfQERuTypU",
  "https://www.youtube.com/watch?v=F2cv_594arc",
  "https://www.youtube.com/watch?v=PlKoeuRbikY",
  "https://www.youtube.com/watch?v=6ahTu8ErcJE",
  "https://www.youtube.com/watch?v=5BETUpBR0Bc",
  "https://www.youtube.com/watch?v=UZumM2yhG-E",
  "https://www.youtube.com/watch?v=iSYa7GBR-Nw"
]);
const types = new Set(["Roadmap", "Blog", "Message Center", "Ignite"]);
const requestedType = new URLSearchParams(location.search).get("source");
const state = { items: [], type: types.has(requestedType) ? requestedType : "", igniteSource: "" };
const igniteSourceLabels = {
  "": "All sources", session: "Sessions", news: "Book of News", blog: "Blogs",
  roadmap: "Roadmap", message: "Message Center", pdf: "PDF guides",
};
const byId = (id) => document.getElementById(id);

function publicUrl(value) {
  const url = new URL(value);
  if (url.protocol !== "https:" || !allowedHosts.has(url.hostname) ||
      url.username || url.password || url.port ||
      (url.hostname === "news.microsoft.com" && url.pathname !== "/events/ignite/2026/book-of-news/") ||
      (url.hostname === "cdn-dynmedia-1.microsoft.com" && url.href !== publicDocumentUrl) ||
      (url.hostname === "ignite.microsoft.com" && !publicSessionUrls.has(url.href)) ||
      (url.hostname === "www.youtube.com" && !publicVideoUrls.has(url.href))) {
    throw new Error("The snapshot contains an unapproved source URL.");
  }
  return url.href;
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function dateLabel(value) {
  if (!value) return "";
  const date = new Date(`${value.length === 7 ? `${value}-01` : value}T00:00:00Z`);
  if (Number.isNaN(date.valueOf())) throw new Error("The snapshot contains an invalid date.");
  return new Intl.DateTimeFormat("en", {
    month: "short", ...(value.length === 10 ? { day: "numeric" } : {}),
    year: "numeric", timeZone: "UTC",
  }).format(date);
}

function validateItem(item) {
  if (!item || !types.has(item.type) || typeof item.title !== "string" || !item.title.trim() ||
      !Array.isArray(item.products) || !item.products.length ||
      !item.products.every((product) => typeof product === "string" && product.trim())) {
    throw new Error("The public snapshot contains an invalid update.");
  }
  publicUrl(item.url);
  if (new URL(item.url).hostname === "www.youtube.com") {
    throw new Error("An update must link to its public source, not a standalone video.");
  }
  const isSession = publicSessionUrls.has(item.url);
  if (Object.hasOwn(item, "session") || isSession) {
    const session = item.session;
    if (item.type !== "Ignite" || !isSession || !session ||
        Object.keys(session).sort().join(",") !== "evidence,summary,takeaways,videoUrl" ||
        typeof session.summary !== "string" || !session.summary.trim() ||
        session.summary.length > 700 || typeof session.evidence !== "string" ||
        !session.evidence.trim() || session.evidence.length > 700 ||
        !Array.isArray(session.takeaways) || session.takeaways.length < 2 ||
        session.takeaways.length > 3 ||
        !session.takeaways.every((text) => typeof text === "string" && text.trim() && text.length <= 500) ||
        typeof session.videoUrl !== "string" ||
        (session.videoUrl && !publicVideoUrls.has(session.videoUrl))) {
      throw new Error("The public snapshot contains invalid session details.");
    }
    if (session.videoUrl) publicUrl(session.videoUrl);
  }
}

function card(item) {
  const article = element("article", item.type === "Ignite" ? "card card-ignite" : "card");
  const top = element("div", "card-top");
  top.append(element("span", "kind", item.type === "Ignite" ? "Ignite 2026" : item.type),
    element("span", "reference", item.reference));
  const title = element("h3");
  const titleLink = element("a", "title-link", item.title);
  titleLink.href = publicUrl(item.url);
  titleLink.target = "_blank";
  titleLink.rel = "noopener noreferrer";
  title.append(titleLink);
  article.append(top, title);
  const tags = element("div", "tags");
  item.products.forEach((product) => tags.append(element("span", "tag", product)));
  if (item.status) tags.append(element("span", "tag", item.status));
  article.append(tags);
  if (item.session) {
    article.append(element("p", "session-summary", item.session.summary));
    const details = element("details", "session-details");
    const summary = element("summary", "", "Session details");
    summary.setAttribute("aria-label", `Session details: ${item.title}`);
    const heading = element("h4", "", "Key takeaways");
    const list = element("ul");
    item.session.takeaways.forEach((text) => list.append(element("li", "", text)));
    details.append(summary, heading, list);
    if (item.session.videoUrl) {
      const video = element("a", "session-video", "Watch official video");
      video.href = publicUrl(item.session.videoUrl);
      video.target = "_blank";
      video.rel = "noopener noreferrer";
      video.setAttribute("aria-label", `Watch official video: ${item.title}`);
      details.append(video);
    }
    details.append(element("p", "session-evidence", item.session.evidence));
    article.append(details);
  }
  const timing = [];
  if (item.published) timing.push(`Published ${dateLabel(item.published)}`);
  if (item.release) timing.push(`Estimated GA ${dateLabel(item.release)}`);
  if (timing.length) article.append(element("p", "timing", timing.join(" | ")));
  const source = element("div", "source-line");
  const link = element("a");
  link.href = publicUrl(item.url);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.append(element("span", "", item.session ? "Open session" : "Read the source"), element("span", "", "\u2197"));
  link.setAttribute("aria-label", `Read source: ${item.title}`);
  source.append(link, element("small", "", item.publisher));
  article.append(source);
  return article;
}

function igniteSourceType(item) {
  const url = new URL(item.url);
  if (item.session) return "session";
  if (url.hostname === "news.microsoft.com") return "news";
  if (url.hostname === "msmessagecenter.com") return "message";
  if (url.href === publicDocumentUrl) return "pdf";
  if (url.hostname === "www.microsoft.com" && url.pathname === "/en-us/microsoft-365/roadmap") return "roadmap";
  if (["www.microsoft.com", "techcommunity.microsoft.com", "blogs.microsoft.com", "devblogs.microsoft.com"].includes(url.hostname)) return "blog";
  throw new Error("The snapshot contains an unsupported Ignite source type.");
}

function render() {
  const search = byId("search").value.trim().toLocaleLowerCase();
  const product = byId("product").value;
  const items = state.items.filter((item) =>
    (!state.type || item.type === state.type) &&
    (state.type !== "Ignite" || !state.igniteSource || igniteSourceType(item) === state.igniteSource) &&
    (!product || item.products.includes(product)) &&
    `${item.title} ${item.reference} ${item.products.join(" ")} ${item.status} ${item.publisher} ${item.type === "Ignite" ? "Ignite 2026" : item.type} ${item.session ? `${item.session.summary} ${item.session.takeaways.join(" ")}` : ""}`
      .toLocaleLowerCase().includes(search));
  const sort = byId("sort").value;
  items.sort((a, b) => {
    if (sort === "title") return a.title.localeCompare(b.title);
    if (sort === "source") return a.type.localeCompare(b.type) || a.title.localeCompare(b.title);
    return (b.published || "").localeCompare(a.published || "") || a.title.localeCompare(b.title);
  });
  byId("results").replaceChildren(...items.map(card));
  byId("empty").hidden = items.length > 0;
  byId("result-count").textContent = `${items.length} of ${state.items.length} updates`;
  byId("results-heading").textContent = {
    "": "All updates", Roadmap: "Roadmap features", Blog: "Public blogs",
    "Message Center": "Message Center updates", Ignite: "Ignite 2026 updates",
  }[state.type];
  byId("ignite-source-filter").hidden = state.type !== "Ignite";
  document.querySelectorAll(".source-chip").forEach((chip) => {
    const active = chip.dataset.igniteSource === state.igniteSource;
    chip.classList.toggle("active", active);
    chip.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll(".tab").forEach((tab) => {
    const active = tab.dataset.type === state.type;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll(".product-chip").forEach((chip) => {
    const active = chip.dataset.product === product;
    chip.classList.toggle("active", active);
    chip.setAttribute("aria-pressed", String(active));
  });
}

function selectSource(type) {
  state.type = type;
  if (type !== "Ignite") state.igniteSource = "";
  const url = new URL(location.href);
  if (state.type) url.searchParams.set("source", state.type);
  else url.searchParams.delete("source");
  history.replaceState(null, "", url);
  render();
}

function productChip(product, count) {
  const chip = element("button", "product-chip", product || "All products");
  chip.type = "button";
  chip.dataset.product = product;
  chip.setAttribute("aria-pressed", "false");
  chip.append(element("span", "", String(count)));
  chip.addEventListener("click", () => {
    byId("product").value = product;
    render();
  });
  return chip;
}

async function load() {
  try {
    const response = await fetch("data.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`Could not load the public snapshot (HTTP ${response.status}).`);
    const data = await response.json();
    if (data.schemaVersion !== 2 || !Array.isArray(data.items) || !data.items.length ||
        !/^\d{4}-\d{2}-\d{2}$/.test(data.snapshotDate)) {
      throw new Error("The public snapshot is missing or has an unsupported format.");
    }
    data.items.forEach(validateItem);
    state.items = data.items;
    const igniteItems = state.items.filter((item) => item.type === "Ignite");
    const sourceCounts = new Map(Object.keys(igniteSourceLabels).map((key) => [key, 0]));
    igniteItems.forEach((item) => {
      const source = igniteSourceType(item);
      sourceCounts.set(source, sourceCounts.get(source) + 1);
    });
    sourceCounts.set("", igniteItems.length);
    Object.entries(igniteSourceLabels).forEach(([source, label]) => {
      const chip = element("button", "source-chip", label);
      chip.type = "button";
      chip.dataset.igniteSource = source;
      chip.setAttribute("aria-pressed", "false");
      chip.append(element("span", "", String(sourceCounts.get(source))));
      chip.addEventListener("click", () => {
        state.igniteSource = source;
        render();
      });
      byId("ignite-source-chips").append(chip);
    });
    byId("snapshot-date").textContent = dateLabel(data.snapshotDate);
    document.querySelectorAll("[data-count]").forEach((node) => {
      node.textContent = String(state.items.filter((item) =>
        !node.dataset.count || item.type === node.dataset.count).length);
    });
    byId("product-chips").append(productChip("", state.items.length));
    [...new Set(state.items.flatMap((item) => item.products))].sort().forEach((product) => {
      const option = element("option", "", product);
      option.value = product;
      byId("product").append(option);
      byId("product-chips").append(productChip(product,
        state.items.filter((item) => item.products.includes(product)).length));
    });
    document.querySelectorAll("input, select, .tab, .ignite-action").forEach((control) => { control.disabled = false; });
    render();
  } catch (error) {
    console.error("Public roadmap could not be displayed:", error);
    byId("results").replaceChildren();
    byId("empty").hidden = true;
    byId("error").hidden = false;
    byId("error").textContent = `${error instanceof Error ? error.message : "The snapshot could not be displayed."} Reload the page or open the public data link below.`;
    byId("result-count").textContent = "Snapshot unavailable";
  }
}

byId("search").addEventListener("input", render);
["product", "sort"].forEach((id) => byId(id).addEventListener("change", render));
document.querySelectorAll(".tab").forEach((tab) => tab.addEventListener("click", () => {
  selectSource(tab.dataset.type);
}));
byId("explore-ignite").addEventListener("click", () => selectSource("Ignite"));
byId("reset").addEventListener("click", () => {
  state.type = "";
  state.igniteSource = "";
  byId("search").value = "";
  byId("product").value = "";
  byId("sort").value = "recent";
  const url = new URL(location.href);
  url.searchParams.delete("source");
  history.replaceState(null, "", url);
  render();
  byId("search").focus();
});
load();
