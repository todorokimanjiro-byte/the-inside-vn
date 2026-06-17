import { Product, Article, IngredientStory } from "./types";

export const HERO_SLIDES = [
  {
    id: 1,
    title: "Sự Ôm Ấp Dịu Dàng Từ Thiên Nhiên Việt",
    titleEn: "A Gentle Embrace from Vietnamese Nature",
    subtitle: "Dòng son dưỡng thuần chay THE INSIDE đem đến sự căng mọng, mềm mướt cho đôi môi nhạy cảm mỗi ngày.",
    subtitleEn: "THE INSIDE vegan lip balm brings plumpness and soft hydration to sensitive lips everyday.",
    image: "https://lh3.googleusercontent.com/d/1QntNI66vIy-WUfcNmzwn9RM4YYNSl1WK",
    cta: "Khám phá ngay",
    ctaEn: "Discover Now",
    tagline: "100% VEGAN & CRUELTY-FREE",
    taglineEn: "100% VEGAN & CRUELTY-FREE"
  },
  {
    id: 2,
    title: "Ẩm Mượt Suốt 24 Giờ, Không Khô Ráp",
    titleEn: "24-Hour Hydration, Never Dry",
    subtitle: "Sự kết hợp hoàn hảo giữa bơ thực vật nhiệt đới và sáp thực vật giúp đôi môi luôn được bao bọc nhẹ bẫng.",
    subtitleEn: "The perfect synergy of tropical plant butters and natural waxes wraps your lips in airy comfort.",
    image: "https://i.pinimg.com/736x/20/3a/aa/203aaa533f5da188e3f0a0b509726c83.jpg",
    cta: "Mua ngay",
    ctaEn: "Shop Now",
    tagline: "PHỤC HỒI CHUYÊN SÂU",
    taglineEn: "DEEP RESTORATION"
  },
  {
    id: 3,
    title: "Câu Chuyện Nông Sản Việt Thuần Chay",
    titleEn: "Vibrant Local Vegan Agriculture",
    subtitle: "Chắt lọc dưỡng chất tinh khiết nhất từ quả Đu đủ tự nhiên giúp đôi môi chín mọng rạng ngời và căng tràn sức sống.",
    subtitleEn: "Distilling the purest nutrients from organic Vietnamese Papaya for healthy, radiant, and plump lips.",
    image: "https://i.pinimg.com/736x/ce/19/20/ce19201e830e323459cc2a94493a4ec4.jpg",
    cta: "Trải nghiệm nguyên liệu",
    ctaEn: "Discover Ingredients",
    tagline: "TỰ HÀO NGUỒN GỐC VIỆT",
    taglineEn: "PROUDLY VIETNAMESE"
  }
];

export const PRODUCTS: Product[] = [
  {
    id: "son-duong-du-du",
    name: "Son Dưỡng Đu Đủ The Inside",
    nameEn: "The Inside Papaya Lip Balm",
    subtitle: "Dưỡng ẩm sâu, hương đu đủ dịu nhẹ",
    subtitleEn: "Deep moisture, soft papaya essence",
    price: 89600,
    originalPrice: 128000,
    image: "https://drive.google.com/thumbnail?id=1wQwtobFFpmN6kmgH42LIaM-KFHaPlhu1&sz=w1000",
    rating: 4.9,
    reviewsCount: 142,
    description: "Sản phẩm chứa chiết xuất đu đủ chín giàu enzyme papain tự nhiên giúp loại bỏ lớp tế bào chết khô sần sùi một cách cực kỳ êm dịu. Đồng thời, hàm lượng Vitamin A và C dồi dào thúc đẩy phục hồi vân môi căng đầy, mang lại sự ngậm nước bóng mượt tuyệt đối cho đôi môi từ sáng tới tối muộn.",
    descriptionEn: "Infused with organic papaya extract rich in natural papain enzymes, this balm gently sweeps away flaky skin. Loaded with Vitamins A and C, it actively smooths lip texture, leaving behind an exceptionally plump, hydrated, and glossy finish from dawn to standard dusk.",
    ingredients: [
      "Chiết xuất Đu đủ Việt Nam chín mọng",
      
    ],
    ingredientsEn: [
      "Fresh Vietnamese Papaya Extract",
      "Organic Shea Butter",
      "Pure Rice Bran Oil",
      "Pure Vitamin E",
      "Plant-based Candelilla Wax"
    ],
    benefits: [
      "Làm mềm siêu mịn môi ngay sau khi thoa",
      "Tẩy tế bào chết nhẹ nhàng, tái tạo da môi",
      "Hương thơm ngọt dịu, thanh lịch từ quả chín"
    ],
    benefitsEn: [
      "Instant, buttery softness right after application",
      "Gently cleanses dead skin for lip renewal",
      "Sweet, subtle and luxurious aroma of ripe papaya"
    ],
    howToUse: "Thoa trực tiếp lên môi bất cứ lúc nào trong ngày khi có cảm giác khô ráp. Có thể thoa một lớp dày trước khi đi ngủ làm mặt nạ ngủ môi ban đêm.",
    howToUseEn: "Apply directly to lips whenever dryness is felt. For an intensive treatment, apply a generous layer before bedtime to use as an overnight lip sleep mask."
  }
];

export const INGREDIENTS: IngredientStory[] = [
  {
    id: "ing-du-du",
    name: "Đu đủ",
    nameEn: "Papaya",
    image: "https://i.pinimg.com/736x/e2/7f/62/e27f62b7433d7ad8f3d47e8439dc4512.jpg",
    accentColor: "rgba(224, 110, 53, 0.1)",
    description: "Đu đủ Việt Nam chứa hoạt chất Papain - một loại enzyme phân giải protein kỳ diệu giúp nới lỏng các tế bào da môi xơ cứng khô ráp một cách mềm mại vô hại mà không gây đau rát xước sát.",
    descriptionEn: "Vietnamese organic papaya is rich in Papain - a magical proteolytic enzyme that softly loosens and lifts rough, thickened skin cells without physical abrasiveness.",
    benefit: "Tẩy da chết enzym sinh học tự nhiên, hỗ trợ mờ nếp nhăn môi sâu, chống lão hóa tối đa cho cơ môi.",
    benefitEn: "Biological enzyme exfoliant, actively fade vertical lip lines and shields cells from standard aging.",
    keyCompound: "Enzyme Papain & Vitamin A",
    keyCompoundEn: "Papain Enzyme & Vitamin A"
  }
];

export const ARTICLES: Article[] = [
  {
    id: "art-1",
    title: "Triết lý dưỡng môi thuần chay từ các nhà nông Việt",
    titleEn: "Vegan Lip Care Philosophy Rooted in Local Farms",
    excerpt: "Lý do vì sao loại quả mộc mạc như đu đủ sông Hồng lại là phép màu chữa lành tối tân nhất cho đôi môi đầy vân nứt nẻ.",
    excerptEn: "Why humblest organic crops like Red River Delta Papaya are the ultimate healing antidote for weather-damaged lips.",
    content: "Môi là vùng da đặc biệt mỏng manh bậc nhất trên cơ thể con người. Không giống các vùng mặt thông thường, môi không chứa các tuyến bã nhờn hay mồ hôi để tự bôi trơn dưỡng ẩm. Chính vì điều này, việc lạm dụng son chứa dầu khoáng (petroleum jelly / parafin) công nghiệp giả tạo chỉ tạo ra lớp khóa tạm thời nhưng vô tình chặn đứng quá trình trao đổi oxy của tế bào gốc tự nhiên, khiến môi ngày qua ngày phụ thuộc hóa chất, thâm xỉn nhanh có nếp nhăn thâm quầng sâu sắc.\n\nNhận thấy sự trống trải đau xót đó, THE INSIDE chọn đồng hành cùng người nông dân Việt nhằm mang các bài thuốc tự nhiên tinh túy nhất nâng chở con người. Enzyme Papain tự nhiên dồi dào trích xuất từ hạt đu đủ kết kết hợp bơ thực vật giúp loại bỏ lớp sừng chết êm dịu, lập tức hóa giải sự thô rát mà hoàn toàn an lành, lành mạnh bền bỉ.",
    contentEn: "Lips are uniquely fragile compared to facial skin, lacking sweat glands or sebaceous networks. Overusing petrochemical emollients like petroleum jelly restricts normal tissue gas exchange, increasing dryness and deep lines in the long run.\n\nResponding to this concern, THE INSIDE partners with specialized domestic farmers. The high concentrations of natural Papain enzymes extracted from organic papayas, blended with premium cold-pressed botanical butters, dissolve dead skin cells gently, delivering clean, genuine hydration that recovers dry micro-cracks effectively.",
    image: "https://i.pinimg.com/1200x/57/e0/d2/57e0d22b591dd4c9f9b55ec13658305a.jpg",
    date: "12 Tháng 6, 2026",
    dateEn: "June 12, 2026",
    readingTime: "4 phút đọc",
    readingTimeEn: "4 min read"
  },
  {
    id: "art-2",
    title: "Chăm sóc môi khô nứt nẻ: Đừng chỉ uống nước, hãy khóa sáp",
    titleEn: "Preventing Dry Lips: Hydrate From Within, Restructure On Top",
    excerpt: "Những thói quen âm thầm tàn phá da môi hằng ngày, và cách dùng đúng mặt nạ bơ hạt mỡ đu đủ cứu rỗi làn da môi cấp tốc.",
    excerptEn: "Crucial mistakes that silently damage lip barrier and how beautiful organic wax defenses prevent hydration loss.",
    content: "Nhiều người lầm tưởng đôi môi khô héo cứ uống nhiều nước là tự khắc hết rạn. Thực tế, khi môi đã vào tình trạng mất cân bằng bề mặt biểu bì khô sần nứt nẻ, lượng nước thăng hoa hơi từ cơ thể khuếch tán vào khoảng không khí khô lạnh rất nhanh. Nếu không có màng chắn sinh học khóa giữ ẩm, việc bồi đắp nước càng thúc đẩy tế bào môi co ngót nứt nẻ sâu hơn.\n\nTạo hóa hào phóng mang bơ thực vật (Shea Butter và Cocoa Butter) cùng hỗn hợp sáp thực vật cao cấp như sáp Carnauba, sáp Candelilla dẻo dai làm áo khoác che chở. Chúng ngăn chặn sự bốc hơi nước 100%. Cách dưỡng môi đúng kỹ thuật là thoa một lượng mướt dày son dưỡng chứa đu đủ enzyme ngay trước khi ngủ để tẩy bám sừng nhẹ nhàng ẩm mịn tối đa.",
    contentEn: "Many dry lip sufferers assume just drinking water resolves hydration issues. However, if your skin surface is already fractured, water vapors evaporate even quicker into dry high-altitude air. Without a proper lipid coat, excess moisture can sometimes accelerate superficial chapping.\n\nNature's solution lies in rich organic butters and specialized botanical waxes structure. They seal 100% of moisture inside. Regular bedtime application of our Papaya Balm creates an active micro-barrier, repairing the lip ecosystem while you sleep.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600",
    date: "05 Tháng 6, 2026",
    dateEn: "June 05, 2026",
    readingTime: "5 phút đọc",
    readingTimeEn: "5 min read"
  },
  {
    id: "art-3",
    title: "Xu hướng làm đẹp bền vững và bảo vệ động vật thế hệ mới",
    titleEn: "Sustainable Cruelty-Free Beauty: More Than Labels",
    excerpt: "Tại sao cam kết Vegan (Thuần Chay) và Cruelty-Free (Không thử nghiệm động vật) tại THE INSIDE không đơn thuần chỉ là nhãn mác PR tiếp thị.",
    excerptEn: "Why refusing standard cheap animal derivatives (like Lanolin) is a hard but necessary scientific step for peaceful living.",
    content: "Quyết định từ chối các loại mỡ động vật truyền thống (như mỡ cừu Lanolin thường thấy trong công nghiệp son vì rẻ) hay sáp mật ong không sấy ròng là một thách thức kỹ thuật to lớn đối với THE INSIDE Beauty Co. Chúng tôi chọn hướng đi khó khăn hơn khi chiêu mộ các kỹ sư tài hoa sáng tạo hỗn hợp sáp thực vật có điểm nóng chảy lý ảo vừa mịn ôm giữ ấm, lại vừa đáp ứng văn minh bảo vệ thế giới muôn loài lành sạch.\n\nĐạt các chứng nhận toàn cầu danh giá như The Vegan Society, Leaping Bunny, PETA là lời cam kết trung thực thép tuyệt đối tôn trọng sự sống tự nhiên muôn loài xung quanh loài người. Chúng tôi tin rằng, một làn môi mỉm cười đẹp đẽ rạng ngời chỉ thực sự trọn vẹn khi nó không mang gánh nặng đau thương tàn ác từ bất kỳ một bạn sinh vật thiện lương nhỏ bé nào.",
    contentEn: "Rejecting cheap animal ingredients—like sheep's lanolin or massive beeswax harvesting—posed immense structural challenges. THE INSIDE engineers spent months finding plant-derived waxes with optimal melting profiles, creating a product that is both super soft on lips and respectful of animals.\n\nBearing prestigious international credentials from The Vegan Society, Leaping Bunny, and PETA is our unwavering promise. We guarantee zero animal testing and absolute purity. True beauty glows sweetest when it carries no burden of harm toward any living creature in our delicate biosphere.",
    image: "https://i.pinimg.com/1200x/91/97/9f/91979f9117708a3950c3789726f328a1.jpg",
    date: "28 Tháng 5, 2026",
    dateEn: "May 28, 2026",
    readingTime: "3 phút đọc",
    readingTimeEn: "3 min read"
  }
];

export const BRANDS_CERTIFICATIONS = [
  {
    name: "Leaping Bunny – Cruelty Free",
    nameEn: "Leaping Bunny – Cruelty Free",
    org: "Cruelty Free International",
    desc: "Chứng nhận tiêu chuẩn quốc tế không tiến hành hay tài trợ thử nghiệm trên động vật trong toàn bộ chuỗi cung ứng nguyên vật liệu phát triển dòng son.",
    descEn: "No animal testing across any part of our development and raw material supply chain globally.",
    badgeImg: "🐰",
    subtitle: "CAM KẾT KHÔNG THỬ NGHIỆM ĐỘNG VẬT",
    subtitleEn: "CRUELTY-FREE CERTIFIED"
  },
  {
    name: "The Vegan Society – Vegan",
    nameEn: "The Vegan Society – Vegan",
    org: "The Vegan Society (UK)",
    desc: "Chứng nhận uy tín hàng đầu toàn cầu đảm bảo 100% công thức son dưỡng không chứa bất kỳ chế phẩm từ động vật (như sáp mật ong, lanolin, Carmine đỏ cánh kiến).",
    descEn: "100% plant-derived formula. Free from lanolin, beeswax, and carmine dyes.",
    badgeImg: "🌱",
    subtitle: "100% THUẦN CHAY ĐƯỢC CHỨNG NHẬN",
    subtitleEn: "100% VEGAN CERTIFIED"
  },
  {
    name: "PETA – Animal Test Free & Vegan",
    nameEn: "PETA – Animal Test Free & Vegan",
    org: "People for the Ethical Treatment of Animals",
    desc: "Chứng nhận kép của tổ chức bảo vệ phúc lợi động vật uy tín khổng lồ PETA phủ nhận sạch bóng sự tàn bạo, nuôi dưỡng ý thức sống chan hòa bền vững cùng thiên nhiên.",
    descEn: "Dual cert verifying ethical manufacturing standards and environment-safe practices.",
    badgeImg: "🤝",
    subtitle: "ĐẠI DIỆN HÒA BÌNH CHO MUÔN LOÀI",
    subtitleEn: "PETA CERTIFIED PARTNER"
  }
];
