/**
 * Advanced Product Image Mapping System
 * Data-driven approach using actual Indian E-commerce dataset analysis
 * Maps 200+ specific products to their exact visual representations
 */

interface ProductImageMap {
  [key: string]: string;
}

// Comprehensive product database with exact matches from dataset
const PRODUCT_IMAGE_DATABASE: ProductImageMap = {
  // Sports & Fitness Products
  'football': 'https://images.unsplash.com/photo-1486286701208-1d58e9338013?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'cricket': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=400&fit=crop',
  'cricket bat': 'https://plus.unsplash.com/premium_photo-1679690884082-eaba9eccdcb5?q=80&w=1984&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'basketball': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=400&fit=crop',
  'badminton racket': 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=400&fit=crop',
  'tennis': 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=400&fit=crop',
  'tennis racket': 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=400&fit=crop',
  'yoga mat': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
  'dumbbells': 'https://plus.unsplash.com/premium_photo-1671028546491-f70b21a32cc2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'gym bag': 'https://images.unsplash.com/photo-1692506530242-c12d6c3ae2e2?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'running shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
  'sports shoes': 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
  'skipping rope': 'https://plus.unsplash.com/premium_photo-1664529498751-9bcd541edb9f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'carrom board': 'https://images.unsplash.com/photo-1617300067484-314ed2cfd9a6?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'chess set': 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&h=400&fit=crop',
  'sports jersey': 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=400&fit=crop',
  'resistance bands': 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=400&fit=crop',

  // Electronics
  'washing machine': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=400&fit=crop',
  'geyser': 'https://media.istockphoto.com/id/1324171754/photo/3d-render-of-a-white-electric-water-heater-digital-illustration-of-a-boiler-for-your-business.jpg?s=1024x1024&w=is&k=20&c=mV--t26BZCbt5arqxuP2ttoeORDvoWZNQ8Fa8c9U4Xw=',
  'table fan': 'https://images.unsplash.com/photo-1759339206229-b10e61dd9089?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'air cooler': 'https://media.istockphoto.com/id/820247780/photo/evaporative-air-cooler-fan.jpg?s=2048x2048&w=is&k=20&c=OTOF9ZcXNMB7UjLEFJleqw_iCng2tcgR72DIAQx2P1g=',
  'air conditioner': 'https://plus.unsplash.com/premium_photo-1679943423706-570c6462f9a4?q=80&w=705&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'ceiling fan': 'https://images.unsplash.com/photo-1576503963299-fcd31822b523?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'refrigerator': 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=400&fit=crop',
  'mixer grinder': 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=400&fit=crop',
  'iron box': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=400&fit=crop',
  'electric kettle': 'https://images.unsplash.com/photo-1738520420652-0c47cea3922b?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'microwave oven': 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&h=400&fit=crop',
  'laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
  'smartphone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
  'tv': 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

  // Mobile & Accessories
  'bluetooth headset': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'earphones': 'https://images.unsplash.com/photo-1578319439584-104c94d37305?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'charging cable': 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop',
  'otg cable': 'https://plus.unsplash.com/premium_photo-1675024226990-36dcb7252c62?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'phone stand': 'https://images.unsplash.com/photo-1707651385176-8c7492596164?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'fast charger': 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop',
  'mobile cover': 'https://images.unsplash.com/photo-1593830566460-2464575a9a24?q=80&w=732&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'pop socket': 'https://media.istockphoto.com/id/1085527618/photo/blank-smart-phone-pop-socket-stand-and-holder-for-branding-3d-rendering-illustration.jpg?s=2048x2048&w=is&k=20&c=l45wmdV_FNIYdpTvUu-gi56HaSy1OL1QVYhF6POP0r4=',
  'selfie stick': 'https://images.unsplash.com/photo-1522860747050-bb0c1af38ae9?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'memory card': 'https://images.unsplash.com/photo-1616163611189-8cf86abaca1f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

  // Fashion & Apparel
  'jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
  'saree': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop',
  'blouse': 'https://plus.unsplash.com/premium_photo-1764107149755-5f62a4e5c926?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'sherwani': 'https://images.unsplash.com/photo-1760080838961-4208536db385?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'ethnic wear': 'https://images.unsplash.com/photo-1760080838961-4208536db385?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  't-shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
  'cotton kurta': 'https://plus.unsplash.com/premium_photo-1691030254926-b000af5937b3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'palazzo': 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop',
  'salwar suit': 'https://images.unsplash.com/photo-1583391733981-8b530b760347?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2Fsd2FyJTIwc3VpdHxlbnwwfHwwfHx8MA%3D%3D',
  'lehenga': 'https://images.unsplash.com/photo-1619715613791-89d35b51ff81?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGVoZW5nYXxlbnwwfHwwfHx8MA%3D%3D',
  'western dress': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',

  // Footwear
  'sandals': 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop',
  'heels': 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
  'slippers': 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop',
  'canvas shoes': 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop',
  'kolhapuri chappal': 'https://images.unsplash.com/photo-1563357732-cd38bbef7e81?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hhcHBhbHN8ZW58MHx8MHx8fDA%3D',
  'kids shoes': 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&h=400&fit=crop',

  // Bags & Luggage
  'trolley bag': 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400&h=400&fit=crop',
  'sling bag': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop',
  'school bag': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
  'wallet': 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop',
  'suitcase': 'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHN1aXRjYXNlfGVufDB8fDB8fHww',
  'backpack': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
  'cabin luggage': 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400&h=400&fit=crop',
  'duffle bag': 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop',
  'ladies purse': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
  'laptop bag': 'https://images.unsplash.com/photo-1721800419598-67f296c67b79?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFwdG9wJTIwYmFnfGVufDB8fDB8fHww',
  'travel bag': 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&h=400&fit=crop',

  // Furniture
  'folding chair': 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop',
  'bean bag': 'https://plus.unsplash.com/premium_photo-1682436075106-8e275859ee03?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmVhbiUyMGJhZ3xlbnwwfHwwfHx8MA%3D%3D',
  'mattress': 'https://images.unsplash.com/photo-1691703011149-5fc5a062319d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWF0dHJlc3xlbnwwfHwwfHx8MA%3D%3D',
  'sofa set': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
  'office chair': 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=400&h=400&fit=crop',
  'study table': 'https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3R1ZHklMjB0YWJsZXxlbnwwfHwwfHx8MA%3D%3D',
  'center table': 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGFibGV8ZW58MHx8MHx8fDA%3D',
  'bed': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop',
  'tv unit': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
  'bookshelf': 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&h=400&fit=crop',
  'almirah': 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=400&fit=crop',

  // Home & Kitchen
  'lunch box': 'https://plus.unsplash.com/premium_photo-1661438553846-cdd78379e11b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bHVuY2glMjBib3h8ZW58MHx8MHx8fDA%3D',
  'storage container': 'https://plus.unsplash.com/premium_photo-1663050903073-0cbd2fcece06?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGNvbnRhaW5lcnxlbnwwfHwwfHx8MA%3D%3D',
  'dinner set': 'https://images.unsplash.com/photo-1617784625140-515e220ba148?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlubmVyJTIwc2V0fGVufDB8fDB8fHww',
  'idli maker': 'https://media.istockphoto.com/id/679839234/photo/idli-indian-food-with-pot.webp?a=1&b=1&s=612x612&w=0&k=20&c=D2eoytjRnq4Ua-eWtTkCYcJ-hiSQw2Vpl1I-s-pk6gg=',
  'kadhai': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=400&fit=crop',
  'tawa': 'https://media.istockphoto.com/id/2198810306/photo/close-up-of-homemade-bread-cooking-in-an-iron-tawa-stirred-with-a-steel-spatula.webp?a=1&b=1&s=612x612&w=0&k=20&c=ZhNOnp0lflk23WqjzaaQ7mpYTGyym6aTovqGdpvDJaA=',
  'gas stove': 'https://images.unsplash.com/photo-1629234358103-5b5ee53ece9c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Z2FzJTIwc3RvdmV8ZW58MHx8MHx8fDA%3D',
  'kitchen chimney': 'https://plus.unsplash.com/premium_photo-1686090448422-de8536066f64?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGtpdGNoZW4lMjBjaGltbmV5fGVufDB8fDB8fHww',
  'pressure cooker': 'https://images.unsplash.com/photo-1722684766454-a70335b2d651?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJlc3N1cmUlMjBjb29rZXJ8ZW58MHx8MHx8fDA%3D',
  'non-stick cookware': 'https://images.unsplash.com/photo-1722684766454-a70335b2d651?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJlc3N1cmUlMjBjb29rZXJ8ZW58MHx8MHx8fDA%3D',
  'dosa tawa': 'https://media.istockphoto.com/id/2198810306/photo/close-up-of-homemade-bread-cooking-in-an-iron-tawa-stirred-with-a-steel-spatula.webp?a=1&b=1&s=612x612&w=0&k=20&c=ZhNOnp0lflk23WqjzaaQ7mpYTGyym6aTovqGdpvDJaA=',
  'chapati maker': 'https://media.istockphoto.com/id/1196470228/photo/rolling-pin-and-wheat-dough-with-flour-oil-on-table.webp?a=1&b=1&s=612x612&w=0&k=20&c=I8GyNH-mXY25bfwVPEIjGLaNABbcxwINmo2zVJ5GFZs=',
  'spice rack': 'https://images.unsplash.com/photo-1580116270858-8a0d62b15426?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BpY2UlMjByYWNrfGVufDB8fDB8fHww',
  'kitchen organizer': 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=400&fit=crop',

  // Home Decor
  'wall clock': 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&h=400&fit=crop',
  'table cloth': 'https://plus.unsplash.com/premium_photo-1670869816899-16fe9c7b8cfb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dGFibGUlMjBjbG90aHxlbnwwfHwwfHx8MA%3D%3D',
  'wall sticker': 'https://plus.unsplash.com/premium_photo-1670968418657-805607e97742?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d2FsbCUyMGhhbmdlcnxlbnwwfHwwfHx8MA%3D%3D',
  'wind chime': 'https://images.unsplash.com/photo-1613404824235-3195777a224b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2luZCUyMGNoaW1lfGVufDB8fDB8fHww',
  'flower vase': 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
  'wall painting': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop',
  'cushion covers': 'https://images.unsplash.com/photo-1575277340599-43db25b63b6f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3VzaGlvbiUyMGNvdmVyc3xlbnwwfHwwfHx8MA%3D%3D',
  'curtains': 'https://images.unsplash.com/photo-1577926606472-fc6d3a33f7e1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGN1cnRhaW5zfGVufDB8fDB8fHww',
  'showpiece': 'https://images.unsplash.com/photo-1659500700618-497f7e24ca23?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c2hvd3BpZWNlfGVufDB8fDB8fHww',
  'door mat': 'https://images.unsplash.com/photo-1583674767461-99d1a9850069?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9vciUyMG1hdHxlbnwwfHwwfHx8MA%3D%3D',

  // Books & Stationery
  'study table lamp': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
  'calculator': 'https://images.unsplash.com/photo-1574607383077-47ddc2dc51c4?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'file folders': 'https://plus.unsplash.com/premium_photo-1677402408071-232d1c3c3787?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmlsZSUyMGZvbGRlcnN8ZW58MHx8MHx8fDA%3D',
  'notebook set': 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop',
  'novel': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop',
  'self-help book': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
  'ncert books': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=400&fit=crop',
  'art supplies': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
  'sticky notes': 'https://images.unsplash.com/photo-1591462391971-9ffc57b382b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHN0aWNreSUyMG5vdGVzfGVufDB8fDB8fHww',
  'comics': 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=400&fit=crop',

  // Beauty & Personal Care
  'hair straightener': 'https://plus.unsplash.com/premium_photo-1661349783209-5db2a9a6098f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGhhaXIlMjBzdHJhaWdodG5lcnxlbnwwfHwwfHx8MA%3D%3D',
  'kajal': 'https://media.istockphoto.com/id/1294142400/photo/copy-space-of-kajal-pencil-isolated-on-red-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=yQol-P96oF5yYv-34Lu1nkaqHZLZiSheSYnBF1uH6Vo=',
  'bindi': 'https://images.unsplash.com/photo-1522151656182-013606406818?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZG90fGVufDB8fDB8fHww',
  'sunscreen': 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop',
  'lipstick': 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
  'perfume': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
  'face cream': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
  'hair oil': 'https://images.unsplash.com/photo-1699373381616-6133334e754e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aGFpciUyMG9pbHxlbnwwfHwwfHx8MA%3D%3D',
  'trimmer': 'https://images.unsplash.com/photo-1508380702597-707c1b00695c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJpbW1lcnxlbnwwfHwwfHx8MA%3D%3D',

  // Automotive
  'car polish': 'https://images.unsplash.com/photo-1632823470270-a7d3d03c3e20?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhciUyMHBvbGlzaHxlbnwwfHwwfHx8MA%3D%3D',
  'helmet': 'https://images.unsplash.com/photo-1611004061856-ccc3cbe944b2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVsbWV0fGVufDB8fDB8fHww',
  'parking sensor': 'https://plus.unsplash.com/premium_photo-1740716622371-5e7acf0cd311?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGFya2luZyUyMHNlbnNvcnxlbnwwfHwwfHx8MA%3D%3D',
  'tyre inflator': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop',
  'dashboard camera': 'https://images.unsplash.com/photo-1734802236174-0abeaa6e54f8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGFzaGJvYXJkJTIwY2FtZXJhfGVufDB8fDB8fHww',
  'mobile holder': 'https://images.unsplash.com/photo-1707651385176-8c7492596164?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'car air freshener': 'https://plus.unsplash.com/premium_photo-1664187387270-d8d657d9d6c4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3ByYXl8ZW58MHx8MHx8fDA%3D',
  'jumper cable': 'https://images.unsplash.com/photo-1711056823627-64e9089d4a82?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YyUyMGNhYmxlfGVufDB8fDB8fHww',
  'car vacuum cleaner': 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&h=400&fit=crop',
  'car cover': 'https://images.unsplash.com/photo-1612480741569-51e13c14894f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNhciUyMGNvdmVyfGVufDB8fDB8fHww',
  'tool kit': 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=400&fit=crop',
  'bike lock': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',

  // Jewelry & Accessories
  'mangalsutra': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
  'ring': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
  'nose pin': 'https://images.unsplash.com/photo-1664896291033-0509a0adf4f6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bm9zZSUyMHBpbnxlbnwwfHwwfHx8MA%3D%3D',
  'bangles': 'https://images.unsplash.com/photo-1601482438629-346a273776af?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFuZ2xlc3xlbnwwfHwwfHx8MA%3D%3D',
  'clutch': 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop',
  'sunglasses': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
  'bracelet': 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
  'gold earrings': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop',
  'brooch': 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
  'belt': 'https://images.unsplash.com/photo-1664286074176-5206ee5dc878?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVsdHxlbnwwfHwwfHx8MA%3D%3D',

  // Health & Wellness
  'calcium tablets': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
  'digestive enzyme': 'https://plus.unsplash.com/premium_photo-1672759455960-108db7bacc7e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGFibGV0c3xlbnwwfHwwfHx8MA%3D%3D',
  'vitamin c tablets': 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop',
  'blood pressure monitor': 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=400&h=400&fit=crop',
  'first aid kit': 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&h=400&fit=crop',
  'multivitamin': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
  'ayurvedic supplement': 'https://images.unsplash.com/photo-1521146250551-a5578dcc2e64?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXl1cnZlZGljfGVufDB8fDB8fHww',
  'protein powder': 'https://images.unsplash.com/photo-1693996045899-7cf0ac0229c7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvdGVpbiUyMHBvd2RlcnxlbnwwfHwwfHx8MA%3D%3D',
  'glucometer': 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=400&h=400&fit=crop',
  'pulse oximeter': 'https://images.unsplash.com/photo-1626851528990-fee2c2e6fadb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b3hpbWV0ZXJ8ZW58MHx8MHx8fDA%3D',
  'herbal tea': 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3JlZW4lMjB0ZWF8ZW58MHx8MHx8fDA%3D',

  // Grocery & Gourmet
  'honey': 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG9uZXl8ZW58MHx8MHx8fDA%3D',
  'ready-to-eat': 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=400&fit=crop',
  'tea': 'https://plus.unsplash.com/premium_photo-1674406481284-43eba097a291?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGVhfGVufDB8fDB8fHww',
  'dal': 'https://images.unsplash.com/photo-1702041357314-db5826c96f04?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGFsfGVufDB8fDB8fHww',
  'masala box': 'https://images.unsplash.com/photo-1580116270858-8a0d62b15426?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BpY2UlMjByYWNrfGVufDB8fDB8fHww',
  'vermicelli': 'https://plus.unsplash.com/premium_photo-1674025753567-48b817c5b62c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dmVybWljZWxsaXxlbnwwfHwwfHx8MA%3D%3D',
  'basmati rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
  'coffee': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
  'ghee': 'https://images.unsplash.com/photo-1707425197195-240b7ad69047?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z2hlZXxlbnwwfHwwfHx8MA%3D%3D',
  'papad': 'https://media.istockphoto.com/id/1205798594/photo/papad.webp?a=1&b=1&s=612x612&w=0&k=20&c=NuEfzr-V5cpgUxZYAoVSOhcG8XSnxmYxyx7xAEdOQK0=',
  'cooking oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop',
  'atta': 'https://images.unsplash.com/photo-1714842981153-ffeaf74e7a1a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8d2hlYXQlMjBmbG91cnxlbnwwfHwwfHx8MA%3D%3D',
  'dry fruits': 'https://images.unsplash.com/photo-1598371624473-4d95aca694e3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZHJ5JTIwZnJ1aXRzfGVufDB8fDB8fHww',
  'pickle': 'https://images.unsplash.com/photo-1617854307432-13950e24ba07?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGlja2xlfGVufDB8fDB8fHww',
  'organic spices': 'https://images.unsplash.com/photo-1580116270858-8a0d62b15426?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BpY2UlMjByYWNrfGVufDB8fDB8fHww',

  // Toys & Baby Products
  'baby monitor': 'https://images.unsplash.com/photo-1716972065448-e08a46809530?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFhYnklMjBwcm9kdWN0c3xlbnwwfHwwfHx8MA%3D%3D',
  'baby walker': 'https://images.unsplash.com/photo-1611223355350-5be15e624fdf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFieSUyMGNhYXJ5aW5nJTIwd2hlZWxlcnxlbnwwfHwwfHx8MA%3D%3D',
  'remote control car': 'https://media.istockphoto.com/id/2221262933/photo/radio-controlled-car-built-at-home-kept-on-a-natural-light-and-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=-Lo5QinxRmW8HZjbueQwg14tVm52SysDJh103XyIv_c=',
  'doll set': 'https://images.unsplash.com/photo-1644330155911-9a4ef563f39a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZG9sbCUyMHNldHxlbnwwfHwwfHx8MA%3D%3D',
  'puzzle': 'https://images.unsplash.com/photo-1612611741189-a9b9eb01d515?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHV6emxlfGVufDB8fDB8fHww',
  'educational toy': 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop',
  'baby powder': 'https://images.unsplash.com/photo-1716972065448-e08a46809530?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFhYnklMjBwcm9kdWN0c3xlbnwwfHwwfHx8MA%3D%3D',
  'baby diaper': 'https://images.unsplash.com/photo-1584839404042-8bc21d240e91?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlhcGVyfGVufDB8fDB8fHww',
  'feeding bottle': 'https://media.istockphoto.com/id/77188189/photo/a-baby-being-fed-a-bottle.webp?a=1&b=1&s=612x612&w=0&k=20&c=T0xywjtzeZaZ1ZS-mBin4fKbB_L_fNOWJ7aNHjMocGY=',
  'soft toy': 'https://images.unsplash.com/photo-1644330155911-9a4ef563f39a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZG9sbCUyMHNldHxlbnwwfHwwfHx8MA%3D%3D',
  'board game': 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&h=400&fit=crop',
  'baby lotion': 'https://images.unsplash.com/photo-1716972065448-e08a46809530?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFhYnklMjBwcm9kdWN0c3xlbnwwfHwwfHx8MA%3D%3D',
  'cradle': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop',
  'building blocks': 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop',
  'toy kitchen set': 'https://images.unsplash.com/photo-1760883786219-166f9a0398f1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHRveSUyMHNldHxlbnwwfHwwfHx8MA%3D%3D',

  // Electronics & Appliances
  'led tv': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
  'led tv 43': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
  'water purifier': 'https://images.unsplash.com/photo-1669211659110-3f3db4119b65?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2F0ZXIlMjBwdXJpZmllcnxlbnwwfHwwfHx8MA%3D%3D',
  'rice cooker': 'https://images.unsplash.com/photo-1722684766454-a70335b2d651?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJlc3N1cmUlMjBjb29rZXJ8ZW58MHx8MHx8fDA%3D',
  'induction cooktop': 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&h=400&fit=crop',
  'nebulizer': 'https://images.unsplash.com/photo-1645273474732-8fd9c63a148f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'water bottle': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
  'thermometer': 'https://plus.unsplash.com/premium_photo-1678309914508-75dc4e854a8a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGhlcm1vbWV0cmV8ZW58MHx8MHx8fDA%3D',

  // Fashion & Apparel - Additional
  'kurti': 'https://images.unsplash.com/photo-1741847639057-b51a25d42892?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a3VydGl8ZW58MHx8MHx8fDA%3D',
  'churidar': 'https://images.unsplash.com/photo-1583391733981-8b530b760347?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2Fsd2FyJTIwc3VpdHxlbnwwfHwwfHx8MA%3D%3D',
  'dhoti': 'https://images.unsplash.com/photo-1650632784627-d62cdce5e84f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGhvdGl8ZW58MHx8MHx8fDA%3D',
  'shirt': 'https://plus.unsplash.com/premium_photo-1678218594563-9fe0d16c6838?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2hpcnR8ZW58MHx8MHx8fDA%3D',
  'bed sheet': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop',

  // Footwear - Additional
  'boots': 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=400&fit=crop',
  'loafers': 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&h=400&fit=crop',
  'flip flops': 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop',
  'formal shoes': 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&h=400&fit=crop',
  'ethnic footwear': 'https://images.unsplash.com/photo-1563357732-cd38bbef7e81?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hhcHBhbHN8ZW58MHx8MHx8fDA%3D',
  'casual shoes': 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop',
  'mojari': 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop',

  // Bags & Accessories - Additional
  'handbag': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
  'tote bag': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop',
  'waist pouch': 'https://images.unsplash.com/photo-1730637207122-c634d22d1f9c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

  // Furniture - Additional
  'dining table': 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=400&fit=crop',
  'computer table': 'https://images.unsplash.com/photo-1618798600593-ae4ee8c2c7a2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29tcHV0ZXIlMjB0YWJsZXxlbnwwfHwwfHx8MA%3D%3D',
  'shoe rack': 'https://images.unsplash.com/photo-1685883785966-502b1a50f268?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'rocking chair': 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=400&h=400&fit=crop',

  // Home Decor - Additional
  'diya set': 'https://media.istockphoto.com/id/2184643825/photo/full-frame-image-of-thali-containing-diwali-oil-lamps-unrecognisable-women-selecting-mitti.jpg?s=2048x2048&w=is&k=20&c=nFmFaFjtYBaPS8tOmhCpyvIX_fzQivFic3K5LNg4Ryw=',
  'photo frame': 'https://images.unsplash.com/photo-1582053628662-c65b0e0544e9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGhvdG8lMjBmcmFtZXxlbnwwfHwwfHx8MA%3D%3D',
  'rangoli stencil': 'https://images.unsplash.com/photo-1605302977140-6572a4421aef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZ29saXxlbnwwfHwwfHx8MA%3D%3D',
  'lantern': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',

  // Books & Stationery - Additional
  'dictionary': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop',
  'competitive exam guide': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=400&fit=crop',
  'magazine subscription': 'https://images.unsplash.com/photo-1558101215-255b7dec681b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFnemluZXxlbnwwfHwwfHx8MA%3D%3D',
  'pen set': 'https://images.unsplash.com/photo-1605641987901-77d82814989d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVuJTIwc2V0fGVufDB8fDB8fHww',

  // Beauty & Personal Care - Additional
  'shampoo': 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hhbXBvb3xlbnwwfHwwfHx8MA%3D%3D',
  'face wash': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
  'body lotion': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
  'nail polish': 'https://images.unsplash.com/photo-1602585578130-c9076e09330d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmFpbCUyMHBvbGlzaHxlbnwwfHwwfHx8MA%3D%3D',
  'mehendi cone': 'https://media.istockphoto.com/id/1304502841/photo/henna-colors-wedding.webp?a=1&b=1&s=612x612&w=0&k=20&c=odPjOHm2v3OCfS-a845UIPYyVO6KFUu1i1qIkAeGpe8=',
  'soap': 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29hcHxlbnwwfHwwfHx8MA%3D%3D',

  // Automotive - Additional
  'bike cover': 'https://images.unsplash.com/photo-1761486554764-1e4cbb2f60f0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmlrZSUyMGNvdmVyfGVufDB8fDB8fHww',
  'seat cover': 'https://images.unsplash.com/photo-1583574004402-92cdbaa3528f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FyJTIwc2VhdCUyMGNvdmVyfGVufDB8fDB8fHww',
  'steering cover': 'https://images.unsplash.com/photo-1713027420494-00476eac798a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3RlZXJpbmclMjBjb3ZlcnxlbnwwfHwwfHx8MA%3D%3D',

  // Jewelry & Accessories - Additional
  'artificial jewelry': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
  'silver necklace': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
  'hair accessories': 'https://images.unsplash.com/photo-1634082983637-c1382c567945?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29tYnxlbnwwfHwwfHx8MA%3D%3D',
  'watch': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&h=400&fit=crop',

  // Health & Wellness - Additional
  'immunity booster': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
  'protein supplement': 'https://images.unsplash.com/photo-1693996045899-7cf0ac0229c7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvdGVpbiUyMHBvd2RlcnxlbnwwfHwwfHx8MA%3D%3D',
  'health drink': 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3JlZW4lMjB0ZWF8ZW58MHx8MHx8fDA%3D',

  // Sports & Fitness - Additional
  'volleyball': 'https://images.unsplash.com/photo-1666901356149-93f2eb3ba5a2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dm9sbGV5YmFsbHxlbnwwfHwwfHx8MA%3D%3D',
  'cricket ball': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=400&fit=crop',

  // Mobile & Accessories - Additional
  'power bank': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop',
  'screen protector': 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
  'wireless earbuds': 'https://images.unsplash.com/photo-1578319439584-104c94d37305?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
};

/**
 * Advanced image matching using fuzzy logic and similarity scoring
 */
export function getProductImage(productName: string, category?: string): string {
  const normalizedName = productName.toLowerCase().trim();
  
  // Direct exact match
  if (PRODUCT_IMAGE_DATABASE[normalizedName]) {
    return PRODUCT_IMAGE_DATABASE[normalizedName];
  }

  // Fuzzy matching with similarity scoring
  const matches = Object.entries(PRODUCT_IMAGE_DATABASE)
    .map(([key, url]) => ({
      key,
      url,
      score: calculateSimilarity(key, normalizedName)
    }))
    .filter(match => match.score > 0.3)
    .sort((a, b) => b.score - a.score);

  if (matches.length > 0) {
    return matches[0].url;
  }

  // Category-based fallback
  return getCategoryImage(category);
}

/**
 * Calculate similarity score between product names
 * Uses word overlap and substring matching
 */
function calculateSimilarity(key: string, name: string): number {
  const keyWords = key.split(' ').filter(w => w.length > 2);
  const nameWords = name.split(' ').filter(w => w.length > 2);
  
  let score = 0;
  
  // Exact word matches (highest weight)
  keyWords.forEach(kw => {
    if (nameWords.includes(kw)) {
      score += 1.0;
    }
  });
  
  // Substring matches (medium weight)
  keyWords.forEach(kw => {
    nameWords.forEach(nw => {
      if (kw.length > 3 && nw.includes(kw)) {
        score += 0.5;
      } else if (nw.length > 3 && kw.includes(nw)) {
        score += 0.5;
      }
    });
  });
  
  // Normalize by length
  return score / Math.max(keyWords.length, nameWords.length, 1);
}

/**
 * Get category-specific fallback image
 */
function getCategoryImage(category?: string): string {
  if (!category) return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
  
  const cat = category.toLowerCase();
  
  const categoryMap: Record<string, string> = {
    'sports': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop',
    'fitness': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop',
    'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop',
    'fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop',
    'apparel': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop',
    'footwear': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    'bags': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    'luggage': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    'furniture': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    'kitchen': 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=400&fit=crop',
    'home': 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=400&fit=crop',
    'decor': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=400&fit=crop',
    'books': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=400&fit=crop',
    'stationery': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=400&fit=crop',
    'beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    'personal': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    'automotive': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop',
    'jewelry': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
    'accessories': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
    'health': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
    'wellness': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop',
    'grocery': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop',
    'gourmet': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop',
    'toys': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop',
    'baby': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop',
    'mobile': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
  };

  for (const [key, url] of Object.entries(categoryMap)) {
    if (cat.includes(key)) {
      return url;
    }
  }
  
  return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
}
