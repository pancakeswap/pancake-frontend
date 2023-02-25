import { useTheme } from '@pancakeswap/hooks'
import { AtomBox } from '@pancakeswap/ui'
import { AutoRow, Heading, Text } from '@pancakeswap/uikit'
import { format } from 'd3'
// import { saturate } from 'polished'
import { LightCard } from 'components/Card'
import { Chart } from 'components/LiquidityChartRangeInput/Chart'
import { Bound } from 'config/constants/types'
import Image from 'next/image'
import { useCallback } from 'react'

const MOCK = {
  ticksAtLimit: {
    LOWER: false,
    UPPER: false,
  },
  formattedData: [
    {
      activeLiquidity: 66039889711100650,
      price0: 0.00009016,
    },
    {
      activeLiquidity: 66389385366153420,
      price0: 0.0000907,
    },
    {
      activeLiquidity: 66039889711100650,
      price0: 0.00009125,
    },
    {
      activeLiquidity: 66039889711100650,
      price0: 0.0000918,
    },
    {
      activeLiquidity: 66039889711100650,
      price0: 0.00009235,
    },
    {
      activeLiquidity: 66147581183066840,
      price0: 0.0000929,
    },
    {
      activeLiquidity: 66147581183066840,
      price0: 0.00009346,
    },
    {
      activeLiquidity: 66147581183066840,
      price0: 0.00009459,
    },
    {
      activeLiquidity: 66147581183066840,
      price0: 0.00009516,
    },
    {
      activeLiquidity: 66147581183066840,
      price0: 0.00009573,
    },
    {
      activeLiquidity: 66155748648093450,
      price0: 0.00009631,
    },
    {
      activeLiquidity: 66156304196813490,
      price0: 0.00009689,
    },
    {
      activeLiquidity: 66156304196813490,
      price0: 0.00009747,
    },
    {
      activeLiquidity: 66156304196813490,
      price0: 0.00009806,
    },
    {
      activeLiquidity: 66156304196813490,
      price0: 0.00009865,
    },
    {
      activeLiquidity: 66231789520110860,
      price0: 0.00009924,
    },
    {
      activeLiquidity: 116949902028862340,
      price0: 0.00009984,
    },
    {
      activeLiquidity: 116949902028862340,
      price0: 0.00010044,
    },
    {
      activeLiquidity: 116990567274626600,
      price0: 0.00010105,
    },
    {
      activeLiquidity: 116990567274626600,
      price0: 0.00010165,
    },
    {
      activeLiquidity: 116161518605231540,
      price0: 0.00010226,
    },
    {
      activeLiquidity: 116161518605231540,
      price0: 0.00010288,
    },
    {
      activeLiquidity: 116178864889219800,
      price0: 0.0001035,
    },
    {
      activeLiquidity: 116564058155654660,
      price0: 0.00010412,
    },
    {
      activeLiquidity: 116566874492984220,
      price0: 0.00010475,
    },
    {
      activeLiquidity: 116576498970280060,
      price0: 0.00010538,
    },
    {
      activeLiquidity: 120102786298227680,
      price0: 0.00010601,
    },
    {
      activeLiquidity: 120102786298227680,
      price0: 0.00010665,
    },
    {
      activeLiquidity: 120128897565476110,
      price0: 0.00010729,
    },
    {
      activeLiquidity: 120552440678844780,
      price0: 0.00010794,
    },
    {
      activeLiquidity: 120552440678844780,
      price0: 0.00010859,
    },
    {
      activeLiquidity: 120552643995129400,
      price0: 0.00010924,
    },
    {
      activeLiquidity: 131507986570924180,
      price0: 0.0001099,
    },
    {
      activeLiquidity: 131920722044599180,
      price0: 0.00011056,
    },
    {
      activeLiquidity: 823749005978267600,
      price0: 0.00011123,
    },
    {
      activeLiquidity: 823749138726660500,
      price0: 0.0001119,
    },
    {
      activeLiquidity: 823749174316217200,
      price0: 0.00011257,
    },
    {
      activeLiquidity: 823750579323854200,
      price0: 0.00011325,
    },
    {
      activeLiquidity: 823752169981045400,
      price0: 0.00011393,
    },
    {
      activeLiquidity: 823784550849062500,
      price0: 0.00011461,
    },
    {
      activeLiquidity: 824234421391281700,
      price0: 0.0001153,
    },
    {
      activeLiquidity: 824500328931720200,
      price0: 0.000116,
    },
    {
      activeLiquidity: 824500346838589600,
      price0: 0.00011669,
    },
    {
      activeLiquidity: 824543864646245900,
      price0: 0.0001174,
    },
    {
      activeLiquidity: 824543916764661500,
      price0: 0.0001181,
    },
    {
      activeLiquidity: 825293972288248300,
      price0: 0.00011881,
    },
    {
      activeLiquidity: 825466253036748300,
      price0: 0.00011953,
    },
    {
      activeLiquidity: 825751066904322800,
      price0: 0.00012025,
    },
    {
      activeLiquidity: 826020174281755000,
      price0: 0.00012097,
    },
    {
      activeLiquidity: 826020845208366100,
      price0: 0.0001217,
    },
    {
      activeLiquidity: 826455006796873200,
      price0: 0.00012243,
    },
    {
      activeLiquidity: 827043811319842600,
      price0: 0.00012317,
    },
    {
      activeLiquidity: 827045604641964500,
      price0: 0.00012391,
    },
    {
      activeLiquidity: 847237902466579200,
      price0: 0.00012466,
    },
    {
      activeLiquidity: 848783498031776600,
      price0: 0.00012541,
    },
    {
      activeLiquidity: 848833123150780800,
      price0: 0.00012616,
    },
    {
      activeLiquidity: 851129210078998900,
      price0: 0.00012692,
    },
    {
      activeLiquidity: 851329156241002000,
      price0: 0.00012768,
    },
    {
      activeLiquidity: 851329156241002000,
      price0: 0.00012845,
    },
    {
      activeLiquidity: 851401288619958500,
      price0: 0.00012923,
    },
    {
      activeLiquidity: 856318828572033300,
      price0: 0.00013,
    },
    {
      activeLiquidity: 856496841445579900,
      price0: 0.00013079,
    },
    {
      activeLiquidity: 856668023812248200,
      price0: 0.00013157,
    },
    {
      activeLiquidity: 857429775183523100,
      price0: 0.00013236,
    },
    {
      activeLiquidity: 860139613173570600,
      price0: 0.00013316,
    },
    {
      activeLiquidity: 860139613262587400,
      price0: 0.00013396,
    },
    {
      activeLiquidity: 866747969043600900,
      price0: 0.00013477,
    },
    {
      activeLiquidity: 866751850445986200,
      price0: 0.00013558,
    },
    {
      activeLiquidity: 867183687489390700,
      price0: 0.00013639,
    },
    {
      activeLiquidity: 868037515490858600,
      price0: 0.00013722,
    },
    {
      activeLiquidity: 868038488125465000,
      price0: 0.00013804,
    },
    {
      activeLiquidity: 868815901211574900,
      price0: 0.00013887,
    },
    {
      activeLiquidity: 868838398630684000,
      price0: 0.00013971,
    },
    {
      activeLiquidity: 868854949211428900,
      price0: 0.00014055,
    },
    {
      activeLiquidity: 871595799975333400,
      price0: 0.00014139,
    },
    {
      activeLiquidity: 872290907676992300,
      price0: 0.00014224,
    },
    {
      activeLiquidity: 873268223011501300,
      price0: 0.0001431,
    },
    {
      activeLiquidity: 874344024810114300,
      price0: 0.00014396,
    },
    {
      activeLiquidity: 882969868464642000,
      price0: 0.00014483,
    },
    {
      activeLiquidity: 883665185893286500,
      price0: 0.0001457,
    },
    {
      activeLiquidity: 884045720709892700,
      price0: 0.00014658,
    },
    {
      activeLiquidity: 886091165980532000,
      price0: 0.00014746,
    },
    {
      activeLiquidity: 886294822541803900,
      price0: 0.00014835,
    },
    {
      activeLiquidity: 886478518669784400,
      price0: 0.00014924,
    },
    {
      activeLiquidity: 886502973360016000,
      price0: 0.00015014,
    },
    {
      activeLiquidity: 889867329097937900,
      price0: 0.00015104,
    },
    {
      activeLiquidity: 890126503146172700,
      price0: 0.00015195,
    },
    {
      activeLiquidity: 895260989592862500,
      price0: 0.00015286,
    },
    {
      activeLiquidity: 903057591369521400,
      price0: 0.00015378,
    },
    {
      activeLiquidity: 904269881026899300,
      price0: 0.00015471,
    },
    {
      activeLiquidity: 904440095896147700,
      price0: 0.00015564,
    },
    {
      activeLiquidity: 913256692406421800,
      price0: 0.00015658,
    },
    {
      activeLiquidity: 914063667337801600,
      price0: 0.00015752,
    },
    {
      activeLiquidity: 914379201011305000,
      price0: 0.00015847,
    },
    {
      activeLiquidity: 914494465934780400,
      price0: 0.00015942,
    },
    {
      activeLiquidity: 914907820681700700,
      price0: 0.00016038,
    },
    {
      activeLiquidity: 921622034720329600,
      price0: 0.00016134,
    },
    {
      activeLiquidity: 921802751137905200,
      price0: 0.00016232,
    },
    {
      activeLiquidity: 922643955746276900,
      price0: 0.00016329,
    },
    {
      activeLiquidity: 923684274006633700,
      price0: 0.00016428,
    },
    {
      activeLiquidity: 924833736792292600,
      price0: 0.00016526,
    },
    {
      activeLiquidity: 936239436567269900,
      price0: 0.00016626,
    },
    {
      activeLiquidity: 939142547917928700,
      price0: 0.00016726,
    },
    {
      activeLiquidity: 941902516056005900,
      price0: 0.00016827,
    },
    {
      activeLiquidity: 948676616635356000,
      price0: 0.00016928,
    },
    {
      activeLiquidity: 950596503157044400,
      price0: 0.0001703,
    },
    {
      activeLiquidity: 950868380416141600,
      price0: 0.00017132,
    },
    {
      activeLiquidity: 959899671069205800,
      price0: 0.00017235,
    },
    {
      activeLiquidity: 960311871147317400,
      price0: 0.00017339,
    },
    {
      activeLiquidity: 960822553129643100,
      price0: 0.00017443,
    },
    {
      activeLiquidity: 1230086384483017700,
      price0: 0.00017548,
    },
    {
      activeLiquidity: 1230431415608934400,
      price0: 0.00017654,
    },
    {
      activeLiquidity: 1238086411219132200,
      price0: 0.0001776,
    },
    {
      activeLiquidity: 1381682643660790000,
      price0: 0.00017867,
    },
    {
      activeLiquidity: 1382070051243268900,
      price0: 0.00017974,
    },
    {
      activeLiquidity: 1383145325825288000,
      price0: 0.00018083,
    },
    {
      activeLiquidity: 1420844781010911200,
      price0: 0.00018191,
    },
    {
      activeLiquidity: 1424712066605232400,
      price0: 0.00018301,
    },
    {
      activeLiquidity: 1425589960992421400,
      price0: 0.00018411,
    },
    {
      activeLiquidity: 1425625448491543300,
      price0: 0.00018522,
    },
    {
      activeLiquidity: 1426471508979893200,
      price0: 0.00018633,
    },
    {
      activeLiquidity: 1426926153502323700,
      price0: 0.00018745,
    },
    {
      activeLiquidity: 1426958980127117300,
      price0: 0.00018858,
    },
    {
      activeLiquidity: 1456373888089333200,
      price0: 0.00018972,
    },
    {
      activeLiquidity: 1502082032602440400,
      price0: 0.00019086,
    },
    {
      activeLiquidity: 1502155035569200400,
      price0: 0.00019201,
    },
    {
      activeLiquidity: 1503650724524639200,
      price0: 0.00019316,
    },
    {
      activeLiquidity: 1504395624673149200,
      price0: 0.00019433,
    },
    {
      activeLiquidity: 1506851168288264400,
      price0: 0.0001955,
    },
    {
      activeLiquidity: 1515266587657422800,
      price0: 0.00019667,
    },
    {
      activeLiquidity: 1519094348513263400,
      price0: 0.00019785,
    },
    {
      activeLiquidity: 1533121746599155000,
      price0: 0.00019905,
    },
    {
      activeLiquidity: 1645894510948128500,
      price0: 0.00020024,
    },
    {
      activeLiquidity: 1646647595496783600,
      price0: 0.00020145,
    },
    {
      activeLiquidity: 1655894136564719600,
      price0: 0.00020266,
    },
    {
      activeLiquidity: 1658496187493947000,
      price0: 0.00020388,
    },
    {
      activeLiquidity: 1663465037114451000,
      price0: 0.00020511,
    },
    {
      activeLiquidity: 1666349573949416000,
      price0: 0.00020634,
    },
    {
      activeLiquidity: 1667583375057292000,
      price0: 0.00020758,
    },
    {
      activeLiquidity: 1674162759602521300,
      price0: 0.00020883,
    },
    {
      activeLiquidity: 1684441539402111200,
      price0: 0.00021009,
    },
    {
      activeLiquidity: 1685464301642766800,
      price0: 0.00021135,
    },
    {
      activeLiquidity: 1687299713747887900,
      price0: 0.00021263,
    },
    {
      activeLiquidity: 1663668940589670000,
      price0: 0.0002139,
    },
    {
      activeLiquidity: 1671971539004804000,
      price0: 0.00021519,
    },
    {
      activeLiquidity: 1723336561741086500,
      price0: 0.00021649,
    },
    {
      activeLiquidity: 1728326141743410000,
      price0: 0.00021779,
    },
    {
      activeLiquidity: 1739958990113641500,
      price0: 0.0002191,
    },
    {
      activeLiquidity: 1741536577625342000,
      price0: 0.00022042,
    },
    {
      activeLiquidity: 1768513765634740000,
      price0: 0.00022175,
    },
    {
      activeLiquidity: 1773117713338142200,
      price0: 0.00022308,
    },
    {
      activeLiquidity: 1767489224094005500,
      price0: 0.00022442,
    },
    {
      activeLiquidity: 1767043830361897200,
      price0: 0.00022577,
    },
    {
      activeLiquidity: 1773806147638841900,
      price0: 0.00022713,
    },
    {
      activeLiquidity: 1774098929590137600,
      price0: 0.0002285,
    },
    {
      activeLiquidity: 1788706709842176800,
      price0: 0.00022987,
    },
    {
      activeLiquidity: 1791094723367510500,
      price0: 0.00023126,
    },
    {
      activeLiquidity: 1791403961144520400,
      price0: 0.00023265,
    },
    {
      activeLiquidity: 1791669152040089000,
      price0: 0.00023405,
    },
    {
      activeLiquidity: 1792447457381617700,
      price0: 0.00023546,
    },
    {
      activeLiquidity: 1790432727528097500,
      price0: 0.00023687,
    },
    {
      activeLiquidity: 1919478533902590000,
      price0: 0.0002383,
    },
    {
      activeLiquidity: 1923018402872412400,
      price0: 0.00023973,
    },
    {
      activeLiquidity: 1924820981506754800,
      price0: 0.00024118,
    },
    {
      activeLiquidity: 1921225692765167600,
      price0: 0.00024263,
    },
    {
      activeLiquidity: 1782602706515189000,
      price0: 0.00024409,
    },
    {
      activeLiquidity: 1782633598659479300,
      price0: 0.00024556,
    },
    {
      activeLiquidity: 1782856463418335700,
      price0: 0.00024703,
    },
    {
      activeLiquidity: 1782113282065776600,
      price0: 0.00024852,
    },
    {
      activeLiquidity: 1804208858969638100,
      price0: 0.00025002,
    },
    {
      activeLiquidity: 1807833129834287900,
      price0: 0.00025152,
    },
    {
      activeLiquidity: 1811229787020043300,
      price0: 0.00025303,
    },
    {
      activeLiquidity: 1826766610632303900,
      price0: 0.00025456,
    },
    {
      activeLiquidity: 1876621697336313600,
      price0: 0.00025609,
    },
    {
      activeLiquidity: 1886100829303271000,
      price0: 0.00025763,
    },
    {
      activeLiquidity: 1886071473041449700,
      price0: 0.00025918,
    },
    {
      activeLiquidity: 1898760613148266200,
      price0: 0.00026074,
    },
    {
      activeLiquidity: 1907918531053456600,
      price0: 0.00026231,
    },
    {
      activeLiquidity: 1912280796919929600,
      price0: 0.00026389,
    },
    {
      activeLiquidity: 1918098252509229800,
      price0: 0.00026547,
    },
    {
      activeLiquidity: 1930563927531017500,
      price0: 0.00026707,
    },
    {
      activeLiquidity: 1929622291756376600,
      price0: 0.00026868,
    },
    {
      activeLiquidity: 1920563855871387600,
      price0: 0.0002703,
    },
    {
      activeLiquidity: 1941872133942433500,
      price0: 0.00027192,
    },
    {
      activeLiquidity: 1993962334591970300,
      price0: 0.00027356,
    },
    {
      activeLiquidity: 1997502301773396700,
      price0: 0.00027521,
    },
    {
      activeLiquidity: 1993615275956511700,
      price0: 0.00027686,
    },
    {
      activeLiquidity: 1988675964430776300,
      price0: 0.00027853,
    },
    {
      activeLiquidity: 1996627788155004700,
      price0: 0.0002802,
    },
    {
      activeLiquidity: 1995243465270368300,
      price0: 0.00028189,
    },
    {
      activeLiquidity: 2002588269862139000,
      price0: 0.00028359,
    },
    {
      activeLiquidity: 2173716046773607200,
      price0: 0.00028529,
    },
    {
      activeLiquidity: 2194269421401640400,
      price0: 0.00028701,
    },
    {
      activeLiquidity: 2135291972722902800,
      price0: 0.00028874,
    },
    {
      activeLiquidity: 2134508116485227500,
      price0: 0.00029047,
    },
    {
      activeLiquidity: 2133114568283689500,
      price0: 0.00029222,
    },
    {
      activeLiquidity: 2325575740596929500,
      price0: 0.00029398,
    },
    {
      activeLiquidity: 2142857728710335500,
      price0: 0.00029575,
    },
    {
      activeLiquidity: 2143580470524083500,
      price0: 0.00029753,
    },
    {
      activeLiquidity: 2145508288176300500,
      price0: 0.00029932,
    },
    {
      activeLiquidity: 2178436193086956300,
      price0: 0.00030112,
    },
    {
      activeLiquidity: 2211203551132830700,
      price0: 0.00030293,
    },
    {
      activeLiquidity: 2213732015698130200,
      price0: 0.00030476,
    },
    {
      activeLiquidity: 2279585960409283300,
      price0: 0.00030659,
    },
    {
      activeLiquidity: 2280264636197819400,
      price0: 0.00030844,
    },
    {
      activeLiquidity: 2262835348055617800,
      price0: 0.00031029,
    },
    {
      activeLiquidity: 2553275068174281700,
      price0: 0.00031216,
    },
    {
      activeLiquidity: 2559751388000360400,
      price0: 0.00031404,
    },
    {
      activeLiquidity: 2567941450297551400,
      price0: 0.00031593,
    },
    {
      activeLiquidity: 2650873766274326500,
      price0: 0.00031783,
    },
    {
      activeLiquidity: 2652275061272599600,
      price0: 0.00031974,
    },
    {
      activeLiquidity: 3404389066095258600,
      price0: 0.00032166,
    },
    {
      activeLiquidity: 3442524632701927000,
      price0: 0.0003236,
    },
    {
      activeLiquidity: 3442876220922039300,
      price0: 0.00032555,
    },
    {
      activeLiquidity: 3443974688992076300,
      price0: 0.00032751,
    },
    {
      activeLiquidity: 3447592042838224000,
      price0: 0.00032948,
    },
    {
      activeLiquidity: 3496654459618090000,
      price0: 0.00033146,
    },
    {
      activeLiquidity: 3633146604200655400,
      price0: 0.00033346,
    },
    {
      activeLiquidity: 3679570764924497400,
      price0: 0.00033546,
    },
    {
      activeLiquidity: 3689280957218574000,
      price0: 0.00033748,
    },
    {
      activeLiquidity: 3686693850231563300,
      price0: 0.00033951,
    },
    {
      activeLiquidity: 3686773686791016000,
      price0: 0.00034155,
    },
    {
      activeLiquidity: 3686860000229480400,
      price0: 0.00034361,
    },
    {
      activeLiquidity: 3697205242200510000,
      price0: 0.00034568,
    },
    {
      activeLiquidity: 3697915904841149400,
      price0: 0.00034776,
    },
    {
      activeLiquidity: 3697116505445715000,
      price0: 0.00034985,
    },
    {
      activeLiquidity: 3695730174153035300,
      price0: 0.00035196,
    },
    {
      activeLiquidity: 3695722449876161500,
      price0: 0.00035407,
    },
    {
      activeLiquidity: 3711479239387233300,
      price0: 0.0003562,
    },
    {
      activeLiquidity: 3711088652167632000,
      price0: 0.00035835,
    },
    {
      activeLiquidity: 3705915394415875000,
      price0: 0.0003605,
    },
    {
      activeLiquidity: 3743818212666333700,
      price0: 0.00036267,
    },
    {
      activeLiquidity: 3731375675019222500,
      price0: 0.00036486,
    },
    {
      activeLiquidity: 3732122028365518000,
      price0: 0.00036705,
    },
    {
      activeLiquidity: 3750782556638215000,
      price0: 0.00036926,
    },
    {
      activeLiquidity: 3770698068417915000,
      price0: 0.00037148,
    },
    {
      activeLiquidity: 3777293828776406500,
      price0: 0.00037372,
    },
    {
      activeLiquidity: 3791162284551780000,
      price0: 0.00037597,
    },
    {
      activeLiquidity: 3796842674358327000,
      price0: 0.00037823,
    },
    {
      activeLiquidity: 3803063598828722700,
      price0: 0.00038051,
    },
    {
      activeLiquidity: 3802084537094009300,
      price0: 0.0003828,
    },
    {
      activeLiquidity: 3830369140670130700,
      price0: 0.0003851,
    },
    {
      activeLiquidity: 3826264602830390000,
      price0: 0.00038742,
    },
    {
      activeLiquidity: 3825451704733226500,
      price0: 0.00038975,
    },
    {
      activeLiquidity: 3823507690307691500,
      price0: 0.00039209,
    },
    {
      activeLiquidity: 3829627349687078400,
      price0: 0.00039445,
    },
    {
      activeLiquidity: 3876294865523644000,
      price0: 0.00039683,
    },
    {
      activeLiquidity: 3970602740093296000,
      price0: 0.00039921,
    },
    {
      activeLiquidity: 4042235905579372500,
      price0: 0.00040162,
    },
    {
      activeLiquidity: 4060940407274007000,
      price0: 0.00040403,
    },
    {
      activeLiquidity: 4062069365817867000,
      price0: 0.00040647,
    },
    {
      activeLiquidity: 4812836538392037000,
      price0: 0.00040891,
    },
    {
      activeLiquidity: 4762113804880793000,
      price0: 0.00041137,
    },
    {
      activeLiquidity: 4761881758295260000,
      price0: 0.00041385,
    },
    {
      activeLiquidity: 4764189322358342000,
      price0: 0.00041634,
    },
    {
      activeLiquidity: 4757467414008987000,
      price0: 0.00041884,
    },
    {
      activeLiquidity: 4772952696835218000,
      price0: 0.00042136,
    },
    {
      activeLiquidity: 4789738930890864000,
      price0: 0.0004239,
    },
    {
      activeLiquidity: 4790146496082766000,
      price0: 0.00042645,
    },
    {
      activeLiquidity: 4779049540000406000,
      price0: 0.00042902,
    },
    {
      activeLiquidity: 4797289119084803000,
      price0: 0.0004316,
    },
    {
      activeLiquidity: 4796027306614146000,
      price0: 0.0004342,
    },
    {
      activeLiquidity: 4763032557730656000,
      price0: 0.00043681,
    },
    {
      activeLiquidity: 4786889975038356000,
      price0: 0.00043944,
    },
    {
      activeLiquidity: 4788137508021540000,
      price0: 0.00044208,
    },
    {
      activeLiquidity: 4421792615707709400,
      price0: 0.00044474,
    },
    {
      activeLiquidity: 4423152573693702000,
      price0: 0.00044742,
    },
    {
      activeLiquidity: 4424157997570179600,
      price0: 0.00045011,
    },
    {
      activeLiquidity: 4426838815735390000,
      price0: 0.00045282,
    },
    {
      activeLiquidity: 4461769163545210000,
      price0: 0.00045554,
    },
    {
      activeLiquidity: 4465551636626707000,
      price0: 0.00045829,
    },
    {
      activeLiquidity: 4558544785882863600,
      price0: 0.00046104,
    },
    {
      activeLiquidity: 4699486200699297000,
      price0: 0.00046382,
    },
    {
      activeLiquidity: 4827356713451287000,
      price0: 0.00046661,
    },
    {
      activeLiquidity: 4777969871024817000,
      price0: 0.00046942,
    },
    {
      activeLiquidity: 4781094092759518000,
      price0: 0.00047224,
    },
    {
      activeLiquidity: 4836591491220612000,
      price0: 0.00047508,
    },
    {
      activeLiquidity: 4845300586158627000,
      price0: 0.00047794,
    },
    {
      activeLiquidity: 4849118104443196000,
      price0: 0.00048082,
    },
    {
      activeLiquidity: 4858479886710419000,
      price0: 0.00048371,
    },
    {
      activeLiquidity: 4985383351178563000,
      price0: 0.00048662,
    },
    {
      activeLiquidity: 4971927636188676000,
      price0: 0.00048955,
    },
    {
      activeLiquidity: 5001919893478061000,
      price0: 0.0004925,
    },
    {
      activeLiquidity: 6108985489071292000,
      price0: 0.00049546,
    },
    {
      activeLiquidity: 6443844458654879000,
      price0: 0.00049844,
    },
    {
      activeLiquidity: 6839190700678356000,
      price0: 0.00050144,
    },
    {
      activeLiquidity: 6846325314057324000,
      price0: 0.00050446,
    },
    {
      activeLiquidity: 6851219939821532000,
      price0: 0.0005075,
    },
    {
      activeLiquidity: 6504180008558240000,
      price0: 0.00051055,
    },
    {
      activeLiquidity: 6707707195827530000,
      price0: 0.00051362,
    },
    {
      activeLiquidity: 6709548947000638000,
      price0: 0.00051671,
    },
    {
      activeLiquidity: 6707626341825097000,
      price0: 0.00051982,
    },
    {
      activeLiquidity: 6719726601915957000,
      price0: 0.00052295,
    },
    {
      activeLiquidity: 8288337185358083000,
      price0: 0.0005261,
    },
    {
      activeLiquidity: 8370431339763127000,
      price0: 0.00052926,
    },
    {
      activeLiquidity: 8389352860246096000,
      price0: 0.00053245,
    },
    {
      activeLiquidity: 8402525018292452000,
      price0: 0.00053565,
    },
    {
      activeLiquidity: 8733007055593137000,
      price0: 0.00053888,
    },
    {
      activeLiquidity: 8782019035474469000,
      price0: 0.00054212,
    },
    {
      activeLiquidity: 8803523048126610000,
      price0: 0.00054538,
    },
    {
      activeLiquidity: 9004022679614542000,
      price0: 0.00054866,
    },
    {
      activeLiquidity: 9142940493642436000,
      price0: 0.00055196,
    },
    {
      activeLiquidity: 9470810919674080000,
      price0: 0.00055529,
    },
    {
      activeLiquidity: 9614526907078711000,
      price0: 0.00055863,
    },
    {
      activeLiquidity: 9659706917960667000,
      price0: 0.00056199,
    },
    {
      activeLiquidity: 10737210137430858000,
      price0: 0.00056537,
    },
    {
      activeLiquidity: 9666689538701584000,
      price0: 0.00056877,
    },
    {
      activeLiquidity: 9990325342610874000,
      price0: 0.0005722,
    },
    {
      activeLiquidity: 9933287477033998000,
      price0: 0.00057564,
    },
    {
      activeLiquidity: 10028776772503165000,
      price0: 0.0005791,
    },
    {
      activeLiquidity: 10026897724858857000,
      price0: 0.00058259,
    },
    {
      activeLiquidity: 10873638205755425000,
      price0: 0.00058609,
    },
    {
      activeLiquidity: 10988829866293342000,
      price0: 0.00058962,
    },
    {
      activeLiquidity: 11120813779499602000,
      price0: 0.00059317,
    },
    {
      activeLiquidity: 11581711511908100000,
      price0: 0.00059674,
    },
    {
      activeLiquidity: 11463848571437270000,
      price0: 0.00060033,
    },
    {
      activeLiquidity: 11457510667249064000,
      price0: 0.00060394,
    },
    {
      activeLiquidity: 11373254018518680000,
      price0: 0.00060758,
    },
    {
      activeLiquidity: 11395051489285988000,
      price0: 0.00061123,
    },
    {
      activeLiquidity: 11386311462373546000,
      price0: 0.00061491,
    },
    {
      activeLiquidity: 11385453272559708000,
      price0: 0.00061861,
    },
    {
      activeLiquidity: 11299506480048900000,
      price0: 0.00062233,
    },
    {
      activeLiquidity: 11307517440449750000,
      price0: 0.00062608,
    },
    {
      activeLiquidity: 10321083656063937000,
      price0: 0.00062985,
    },
    {
      activeLiquidity: 10258921313627220000,
      price0: 0.00063364,
    },
    {
      activeLiquidity: 10073317374451978000,
      price0: 0.00063745,
    },
    {
      activeLiquidity: 10050992189045938000,
      price0: 0.00064129,
    },
    {
      activeLiquidity: 9670598986560156000,
      price0: 0.00064515,
    },
    {
      activeLiquidity: 9647971247303764000,
      price0: 0.00064903,
    },
    {
      activeLiquidity: 9452604392355942000,
      price0: 0.00065293,
    },
    {
      activeLiquidity: 9314906616781670000,
      price0: 0.00065686,
    },
    {
      activeLiquidity: 9192158834311036000,
      price0: 0.00066082,
    },
    {
      activeLiquidity: 10059827237824260000,
      price0: 0.00066479,
    },
    {
      activeLiquidity: 10033026705237473000,
      price0: 0.00066879,
    },
    {
      activeLiquidity: 9893200928946221000,
      price0: 0.00067282,
    },
    {
      activeLiquidity: 9739394450713238000,
      price0: 0.00067687,
    },
    {
      activeLiquidity: 9724376599128676000,
      price0: 0.00068094,
    },
    {
      activeLiquidity: 9556719280628150000,
      price0: 0.00068504,
    },
    {
      activeLiquidity: 9026178683348651000,
      price0: 0.00068916,
    },
    {
      activeLiquidity: 8988291237021593000,
      price0: 0.00069331,
    },
    {
      activeLiquidity: 8889965115644662000,
      price0: 0.00069748,
    },
    {
      activeLiquidity: 8892624153104869000,
      price0: 0.00070168,
    },
    {
      activeLiquidity: 8891963617960352000,
      price0: 0.0007059,
    },
    {
      activeLiquidity: 8897252702328722000,
      price0: 0.00071015,
    },
    {
      activeLiquidity: 8771945102527722000,
      price0: 0.00071442,
    },
    {
      activeLiquidity: 8639174287221768000,
      price0: 0.00071872,
    },
    {
      activeLiquidity: 8608100558536788000,
      price0: 0.00072304,
    },
    {
      activeLiquidity: 8608819542934821000,
      price0: 0.00072739,
    },
    {
      activeLiquidity: 8641591890614796000,
      price0: 0.00073177,
    },
    {
      activeLiquidity: 8641137485982491000,
      price0: 0.00073618,
    },
    {
      activeLiquidity: 8533261108442062000,
      price0: 0.00074061,
    },
    {
      activeLiquidity: 8411888086047259000,
      price0: 0.00074506,
    },
    {
      activeLiquidity: 8271844950883304000,
      price0: 0.00074955,
    },
    {
      activeLiquidity: 8131386650287818000,
      price0: 0.00075406,
    },
    {
      activeLiquidity: 8109627997295516000,
      price0: 0.00075859,
    },
    {
      activeLiquidity: 8077010069948387000,
      price0: 0.00076316,
    },
    {
      activeLiquidity: 7948153355325037000,
      price0: 0.00076775,
    },
    {
      activeLiquidity: 7937907705398363000,
      price0: 0.00077237,
    },
    {
      activeLiquidity: 7930447079290630000,
      price0: 0.00077702,
    },
    {
      activeLiquidity: 7894156029876631000,
      price0: 0.0007817,
    },
    {
      activeLiquidity: 7894277886039395000,
      price0: 0.0007864,
    },
    {
      activeLiquidity: 7888753998435639000,
      price0: 0.00079113,
    },
    {
      activeLiquidity: 7883663457876343000,
      price0: 0.00079589,
    },
    {
      activeLiquidity: 7856193790185321000,
      price0: 0.00080068,
    },
    {
      activeLiquidity: 7836581821017764000,
      price0: 0.0008055,
    },
    {
      activeLiquidity: 7817923550487351000,
      price0: 0.00081035,
    },
    {
      activeLiquidity: 7816609042163164000,
      price0: 0.00081522,
    },
    {
      activeLiquidity: 7767684754159993000,
      price0: 0.00082013,
    },
    {
      activeLiquidity: 8744575987211637000,
      price0: 0.00082507,
    },
    {
      activeLiquidity: 8709299493012052000,
      price0: 0.00083003,
    },
    {
      activeLiquidity: 7637986050540192000,
      price0: 0.00083503,
    },
    {
      activeLiquidity: 7631476101143897000,
      price0: 0.00084005,
    },
    {
      activeLiquidity: 7602485375104145000,
      price0: 0.00084511,
    },
    {
      activeLiquidity: 7596978388354354000,
      price0: 0.00085019,
    },
    {
      activeLiquidity: 7585249119553777000,
      price0: 0.00085531,
    },
    {
      activeLiquidity: 7518414774756845000,
      price0: 0.00086045,
    },
    {
      activeLiquidity: 6665413233943320000,
      price0: 0.00086563,
    },
    {
      activeLiquidity: 6649438404258371000,
      price0: 0.00087084,
    },
    {
      activeLiquidity: 6636840045634445000,
      price0: 0.00087608,
    },
    {
      activeLiquidity: 6627898363989548000,
      price0: 0.00088135,
    },
    {
      activeLiquidity: 6620981965431157000,
      price0: 0.00088666,
    },
    {
      activeLiquidity: 6648194638163916000,
      price0: 0.00089199,
    },
    {
      activeLiquidity: 6584714178960824000,
      price0: 0.00089736,
    },
    {
      activeLiquidity: 5787970186926848000,
      price0: 0.00090276,
    },
    {
      activeLiquidity: 5557052117128098000,
      price0: 0.00090819,
    },
    {
      activeLiquidity: 5540777079357660000,
      price0: 0.00091366,
    },
    {
      activeLiquidity: 5534411027727505000,
      price0: 0.00091916,
    },
    {
      activeLiquidity: 5499755688239024000,
      price0: 0.00092469,
    },
    {
      activeLiquidity: 5499009569265117000,
      price0: 0.00093025,
    },
    {
      activeLiquidity: 5470056660017140000,
      price0: 0.00093585,
    },
    {
      activeLiquidity: 5467452449464795000,
      price0: 0.00094148,
    },
    {
      activeLiquidity: 5466016458332716000,
      price0: 0.00094715,
    },
    {
      activeLiquidity: 5175876966693669000,
      price0: 0.00095285,
    },
    {
      activeLiquidity: 5145899303931038000,
      price0: 0.00095858,
    },
    {
      activeLiquidity: 5142818821955953000,
      price0: 0.00096435,
    },
    {
      activeLiquidity: 5142502517590758000,
      price0: 0.00097015,
    },
    {
      activeLiquidity: 5139280047326439000,
      price0: 0.00097599,
    },
    {
      activeLiquidity: 5136135543596383000,
      price0: 0.00098187,
    },
    {
      activeLiquidity: 5133132608275901000,
      price0: 0.00098777,
    },
    {
      activeLiquidity: 5128733376960711000,
      price0: 0.00099372,
    },
    {
      activeLiquidity: 2575798001487911000,
      price0: 0.0009997,
    },
    {
      activeLiquidity: 2566972716191722500,
      price0: 0.00100571,
    },
    {
      activeLiquidity: 2555375177868144000,
      price0: 0.00101177,
    },
    {
      activeLiquidity: 2537538328998287000,
      price0: 0.00101785,
    },
    {
      activeLiquidity: 2533032745997671000,
      price0: 0.00102398,
    },
    {
      activeLiquidity: 2532306116502599000,
      price0: 0.00103014,
    },
    {
      activeLiquidity: 2581641379579733500,
      price0: 0.00103634,
    },
    {
      activeLiquidity: 2578053528797113300,
      price0: 0.00104258,
    },
    {
      activeLiquidity: 2517451816132159500,
      price0: 0.00104885,
    },
    {
      activeLiquidity: 2468702182183027000,
      price0: 0.00105516,
    },
    {
      activeLiquidity: 2415553754056637400,
      price0: 0.00106151,
    },
    {
      activeLiquidity: 2413245783063028000,
      price0: 0.0010679,
    },
    {
      activeLiquidity: 2410768780128240600,
      price0: 0.00107433,
    },
    {
      activeLiquidity: 2407934906834722300,
      price0: 0.00108079,
    },
    {
      activeLiquidity: 2405429393300871000,
      price0: 0.0010873,
    },
    {
      activeLiquidity: 2392869325967304700,
      price0: 0.00109384,
    },
    {
      activeLiquidity: 2391276735357581300,
      price0: 0.00110042,
    },
    {
      activeLiquidity: 2943522134098416600,
      price0: 0.00110704,
    },
    {
      activeLiquidity: 2378834007588569600,
      price0: 0.00111371,
    },
    {
      activeLiquidity: 2375331366329947600,
      price0: 0.00112041,
    },
    {
      activeLiquidity: 2363979760062638600,
      price0: 0.00112715,
    },
    {
      activeLiquidity: 2363860181327517700,
      price0: 0.00113393,
    },
    {
      activeLiquidity: 2351274464766932500,
      price0: 0.00114076,
    },
    {
      activeLiquidity: 2356839605648024000,
      price0: 0.00114762,
    },
    {
      activeLiquidity: 2355060891818440700,
      price0: 0.00115453,
    },
    {
      activeLiquidity: 2354822584879367700,
      price0: 0.00116147,
    },
    {
      activeLiquidity: 2346335964859409400,
      price0: 0.00116846,
    },
    {
      activeLiquidity: 2290629738221314600,
      price0: 0.0011755,
    },
    {
      activeLiquidity: 2289072726189911300,
      price0: 0.00118257,
    },
    {
      activeLiquidity: 2204214638650357500,
      price0: 0.00118969,
    },
    {
      activeLiquidity: 2202214521093614800,
      price0: 0.00119685,
    },
    {
      activeLiquidity: 2202146209409393000,
      price0: 0.00120405,
    },
    {
      activeLiquidity: 2170985692113356300,
      price0: 0.00121129,
    },
    {
      activeLiquidity: 2168139603064657000,
      price0: 0.00121858,
    },
    {
      activeLiquidity: 2166631100831596800,
      price0: 0.00122592,
    },
    {
      activeLiquidity: 2165981422508623000,
      price0: 0.00123329,
    },
    {
      activeLiquidity: 2174125206303603200,
      price0: 0.00124071,
    },
    {
      activeLiquidity: 1988322073854997500,
      price0: 0.00124818,
    },
    {
      activeLiquidity: 1934785614216190700,
      price0: 0.00125569,
    },
    {
      activeLiquidity: 1927803011048630300,
      price0: 0.00126325,
    },
    {
      activeLiquidity: 1883836148209527800,
      price0: 0.00127085,
    },
    {
      activeLiquidity: 1882701838526002700,
      price0: 0.0012785,
    },
    {
      activeLiquidity: 1142709992857451900,
      price0: 0.00128619,
    },
    {
      activeLiquidity: 1135681979980349300,
      price0: 0.00129393,
    },
    {
      activeLiquidity: 1134973438422424000,
      price0: 0.00130172,
    },
    {
      activeLiquidity: 1133785012751406500,
      price0: 0.00130955,
    },
    {
      activeLiquidity: 1133542594207030700,
      price0: 0.00131743,
    },
    {
      activeLiquidity: 1130506802068263200,
      price0: 0.00132536,
    },
    {
      activeLiquidity: 893972102182075600,
      price0: 0.00133334,
    },
    {
      activeLiquidity: 864056056131095200,
      price0: 0.00134136,
    },
    {
      activeLiquidity: 863983219527182000,
      price0: 0.00134943,
    },
    {
      activeLiquidity: 863956406645805200,
      price0: 0.00135755,
    },
    {
      activeLiquidity: 849407535821300600,
      price0: 0.00136572,
    },
    {
      activeLiquidity: 848259063971040300,
      price0: 0.00137394,
    },
    {
      activeLiquidity: 848078642933367700,
      price0: 0.00138221,
    },
    {
      activeLiquidity: 846961718930899000,
      price0: 0.00139053,
    },
    {
      activeLiquidity: 845490904065329300,
      price0: 0.00139889,
    },
    {
      activeLiquidity: 845306466897860900,
      price0: 0.00140731,
    },
    {
      activeLiquidity: 818461065624318300,
      price0: 0.00141578,
    },
    {
      activeLiquidity: 544028199314999800,
      price0: 0.0014243,
    },
    {
      activeLiquidity: 543908742258980350,
      price0: 0.00143287,
    },
    {
      activeLiquidity: 539049370717821760,
      price0: 0.00144149,
    },
    {
      activeLiquidity: 537295301282342600,
      price0: 0.00145017,
    },
    {
      activeLiquidity: 536276540212440900,
      price0: 0.00145889,
    },
    {
      activeLiquidity: 534507188921362700,
      price0: 0.00146767,
    },
    {
      activeLiquidity: 532849367306270500,
      price0: 0.00147651,
    },
    {
      activeLiquidity: 531740187387342460,
      price0: 0.00148539,
    },
    {
      activeLiquidity: 501632029294445800,
      price0: 0.00149433,
    },
    {
      activeLiquidity: 499900589991078500,
      price0: 0.00150332,
    },
    {
      activeLiquidity: 497647783521517950,
      price0: 0.00151237,
    },
    {
      activeLiquidity: 487110492525716600,
      price0: 0.00152147,
    },
    {
      activeLiquidity: 480024862128858400,
      price0: 0.00153063,
    },
    {
      activeLiquidity: 474165187407346600,
      price0: 0.00153984,
    },
    {
      activeLiquidity: 472169655285861700,
      price0: 0.0015491,
    },
    {
      activeLiquidity: 471401957517579840,
      price0: 0.00155843,
    },
    {
      activeLiquidity: 471163738937188400,
      price0: 0.0015678,
    },
    {
      activeLiquidity: 466276007563531460,
      price0: 0.00157724,
    },
    {
      activeLiquidity: 464109225733880450,
      price0: 0.00158673,
    },
    {
      activeLiquidity: 367275927581357800,
      price0: 0.00159628,
    },
    {
      activeLiquidity: 366918581276710140,
      price0: 0.00160588,
    },
    {
      activeLiquidity: 366152498588692700,
      price0: 0.00161555,
    },
    {
      activeLiquidity: 365819047837319230,
      price0: 0.00162527,
    },
    {
      activeLiquidity: 363100988719682300,
      price0: 0.00163505,
    },
    {
      activeLiquidity: 358455935569618700,
      price0: 0.00164489,
    },
    {
      activeLiquidity: 357426268575336260,
      price0: 0.00165479,
    },
    {
      activeLiquidity: 101835077306280020,
      price0: 0.00166475,
    },
    {
      activeLiquidity: 99620497042342990,
      price0: 0.00167476,
    },
    {
      activeLiquidity: 97089543585456480,
      price0: 0.00168484,
    },
    {
      activeLiquidity: 90493710620785010,
      price0: 0.00169498,
    },
    {
      activeLiquidity: 90469859688204660,
      price0: 0.00170518,
    },
    {
      activeLiquidity: 90439017648569730,
      price0: 0.00171544,
    },
    {
      activeLiquidity: 90321011266185810,
      price0: 0.00172577,
    },
    {
      activeLiquidity: 90050954072519520,
      price0: 0.00173615,
    },
    {
      activeLiquidity: 89917086368895630,
      price0: 0.0017466,
    },
    {
      activeLiquidity: 88533621513266300,
      price0: 0.00175711,
    },
    {
      activeLiquidity: 88502406041569760,
      price0: 0.00176768,
    },
    {
      activeLiquidity: 88326547237514580,
      price0: 0.00177832,
    },
    {
      activeLiquidity: 88299711128664160,
      price0: 0.00178902,
    },
    {
      activeLiquidity: 88296374435468500,
      price0: 0.00179979,
    },
    {
      activeLiquidity: 88206458012137950,
      price0: 0.00181062,
    },
    {
      activeLiquidity: 99185941189684460,
      price0: 0.00182151,
    },
    {
      activeLiquidity: 99174037975599740,
      price0: 0.00183248,
    },
    {
      activeLiquidity: 96856519726879900,
      price0: 0.0018435,
    },
    {
      activeLiquidity: 96818439967861820,
      price0: 0.0018546,
    },
    {
      activeLiquidity: 96707640587843650,
      price0: 0.00186576,
    },
    {
      activeLiquidity: 96675815092378700,
      price0: 0.00187698,
    },
    {
      activeLiquidity: 96597085298028830,
      price0: 0.00188828,
    },
    {
      activeLiquidity: 95938763173329860,
      price0: 0.00189964,
    },
    {
      activeLiquidity: 95748281751233260,
      price0: 0.00191107,
    },
    {
      activeLiquidity: 95744272263693600,
      price0: 0.00192257,
    },
    {
      activeLiquidity: 95611983865982100,
      price0: 0.00193414,
    },
    {
      activeLiquidity: 95610355530519000,
      price0: 0.00194578,
    },
    {
      activeLiquidity: 95583491705980320,
      price0: 0.00195749,
    },
    {
      activeLiquidity: 95085072517704700,
      price0: 0.00196927,
    },
    {
      activeLiquidity: 94727180069164320,
      price0: 0.00198112,
    },
    {
      activeLiquidity: 69358618819825750,
      price0: 0.00199304,
    },
    {
      activeLiquidity: 40144262430964490,
      price0: 0.00200504,
    },
    {
      activeLiquidity: 39995815576331600,
      price0: 0.0020171,
    },
    {
      activeLiquidity: 39993234804766330,
      price0: 0.00202924,
    },
    {
      activeLiquidity: 35333382330137890,
      price0: 0.00204145,
    },
    {
      activeLiquidity: 35332598363913900,
      price0: 0.00205374,
    },
    {
      activeLiquidity: 33778895569795864,
      price0: 0.0020661,
    },
    {
      activeLiquidity: 33777878177455444,
      price0: 0.00207853,
    },
    {
      activeLiquidity: 33774176210920824,
      price0: 0.00209104,
    },
    {
      activeLiquidity: 33772997627443570,
      price0: 0.00210362,
    },
    {
      activeLiquidity: 33772961766768560,
      price0: 0.00211628,
    },
    {
      activeLiquidity: 33772087271598616,
      price0: 0.00212902,
    },
    {
      activeLiquidity: 33271094262808016,
      price0: 0.00214183,
    },
    {
      activeLiquidity: 33270102078742424,
      price0: 0.00215472,
    },
    {
      activeLiquidity: 33269889448972660,
      price0: 0.00216768,
    },
    {
      activeLiquidity: 33269718107772170,
      price0: 0.00218073,
    },
    {
      activeLiquidity: 33269718107772170,
      price0: 0.00219385,
    },
    {
      activeLiquidity: 33159119502186650,
      price0: 0.00220705,
    },
    {
      activeLiquidity: 21668463455007724,
      price0: 0.00222034,
    },
    {
      activeLiquidity: 21585883959465540,
      price0: 0.0022337,
    },
    {
      activeLiquidity: 19732640642144816,
      price0: 0.00224714,
    },
    {
      activeLiquidity: 19723711952211344,
      price0: 0.00226066,
    },
    {
      activeLiquidity: 19723566878494924,
      price0: 0.00227427,
    },
    {
      activeLiquidity: 19722720987882996,
      price0: 0.00228795,
    },
    {
      activeLiquidity: 19722611620694068,
      price0: 0.00230172,
    },
    {
      activeLiquidity: 19722364990485520,
      price0: 0.00231557,
    },
    {
      activeLiquidity: 19722364990485520,
      price0: 0.0023295,
    },
    {
      activeLiquidity: 19692745166867080,
      price0: 0.00234352,
    },
    {
      activeLiquidity: 19692689791791344,
      price0: 0.00235763,
    },
    {
      activeLiquidity: 19692683878742620,
      price0: 0.00237181,
    },
    {
      activeLiquidity: 14594626535584144,
      price0: 0.00238609,
    },
    {
      activeLiquidity: 14594227263973800,
      price0: 0.00240045,
    },
    {
      activeLiquidity: 14593803891569728,
      price0: 0.00241489,
    },
    {
      activeLiquidity: 14593803891569728,
      price0: 0.00242942,
    },
    {
      activeLiquidity: 14593766422398216,
      price0: 0.00244404,
    },
    {
      activeLiquidity: 14592711747239032,
      price0: 0.00245875,
    },
    {
      activeLiquidity: 14460343080660174,
      price0: 0.00247355,
    },
    {
      activeLiquidity: 14457917321637292,
      price0: 0.00248843,
    },
    {
      activeLiquidity: 16946847002272760,
      price0: 0.99163298,
    },
    {
      activeLiquidity: 223444421405196450,
      price0: 2553.46133069,
    },
    {
      activeLiquidity: 223444421405196450,
      price0: 2599.83744885,
    },
  ],
  price: 0.00062562711,
  brushDomain: [0.000489551, 0.00107433],
}

export function Step3() {
  // const { t } = useTranslation()
  const { theme } = useTheme()

  const brushLabelValue = useCallback((d: 'w' | 'e', x: number) => {
    const { price, ticksAtLimit } = MOCK
    if (!price) return ''

    if (d === 'w' && ticksAtLimit[Bound.LOWER]) return '0'
    if (d === 'e' && ticksAtLimit[Bound.UPPER]) return '∞'

    const percent = (x < price ? -1 : 1) * ((Math.max(x, price) - Math.min(x, price)) / price) * 100

    return price ? `${format(Math.abs(percent) > 1 ? '.2~s' : '.2~f')(percent)}%` : ''
  }, [])

  return (
    <AtomBox textAlign="center">
      <Heading scale="lg" pb="16px">
        V3 Quick Start
      </Heading>
      <Text pb="48px">
        (Overview of v3)Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat.
      </Text>

      <AutoRow
        gap="32px"
        flexWrap={{
          xs: 'wrap',
          md: 'nowrap',
        }}
        alignItems="flex-start"
      >
        <LightCard minWidth={['100%', null, null, '50%']} p="32px">
          <Heading scale="lg" color="secondary" mb="32px">
            Introducing Fee tiers
          </Heading>
          <Image src="/images/decorations/farm-plant-coin.png" width={86} height={124} alt="farm and fee" />
          <Text bold color="textSecondary" my="24px">
            How it works?
          </Text>
          <Text mt="8px">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
          </Text>
        </LightCard>
        <LightCard minWidth={['100%', null, null, '50%']} p="32px">
          <Heading scale="lg" color="secondary">
            Introducing Price Range
          </Heading>
          <Chart
            data={{ current: MOCK.price, series: MOCK.formattedData as any[] }}
            dimensions={{ width: 400, height: 200 }}
            margins={{ top: 10, right: 2, bottom: 20, left: 0 }}
            styles={{
              area: {
                selection: theme.colors.text,
              },
              brush: {
                handle: {
                  west: theme.colors.secondary,
                  east: theme.colors.secondary,
                },
              },
            }}
            interactive
            brushLabels={brushLabelValue}
            brushDomain={MOCK.brushDomain as [number, number]}
            onBrushDomainChange={() => {
              //
            }}
            zoomLevels={{
              initialMin: 0.5,
              initialMax: 2,
              min: 0.00001,
              max: 20,
            }}
            ticksAtLimit={MOCK.ticksAtLimit}
          />
          <Text bold color="textSecondary" mt="24px">
            How it works on the LP?
          </Text>
          <Text mt="8px">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
          </Text>
        </LightCard>
      </AutoRow>
    </AtomBox>
  )
}
