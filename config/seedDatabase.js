import Banner from "../models/banner.model.js";
import Category from "../models/category.model.js";
import Artwork from "../models/artwork.model.js";
import Achievement from "../models/achievement.model.js";
import CelebrityPatron from "../models/celebrityPatron.model.js";
import News from "../models/news.model.js";
import Blog from "../models/blog.model.js";
import Review from "../models/review.model.js";

export const seedDatabase = async () => {
  try {
    // 1. Seed Banners
    const bannerCount = await Banner.countDocuments();
    if (bannerCount === 0) {
      console.log("Seeding default Hero Banners...");
      await Banner.create([
        {
          title: "Bundeli Kalavrat Cultural Art Poster",
          subtitle: "17th Century Frescoes & Royal Miniatures",
          image:
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=2400&q=95",
          alt: "Bundeli Kalavrat Cultural Art Poster",
          order: 1,
          isActive: true,
        },
        {
          title: "Sacred Earth & Mineral Heritage Poster",
          subtitle: "Hand-ground Natural Pigments & Wasli Paper",
          image:
            "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=2400&q=95",
          alt: "Sacred Earth & Mineral Heritage Poster",
          order: 2,
          isActive: true,
        },
        {
          title: "Master Artisans Royal Collection Poster",
          subtitle: "Preserved Through Hereditary Lineages",
          image:
            "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=2400&q=95",
          alt: "Master Artisans Royal Collection Poster",
          order: 3,
          isActive: true,
        },
      ]);
    }

    // 2. Seed Categories
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log("Seeding default Categories...");
      await Category.create([
        {
          name: "Traditional Paintings",
          slug: "paintings",
          shortDescription:
            "Centuries-old miniature, fresco, and tempera painting traditions of Bundelkhand & central India.",
          description:
            "Centuries-old miniature, fresco, and tempera painting traditions of Bundelkhand, Orchha, and central India created with natural mineral pigments on handmade wasli paper.",
          artworkCount: 32,
          image:
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
          featured: true,
          order: 1,
        },
        {
          name: "Folk Art & Murals",
          slug: "folk-art",
          shortDescription:
            "Indigenous expressions including Bundeli Sanjhi stencils, Gond forest folklore, and tribal narratives.",
          description:
            "Indigenous expressions celebrating rural life, mythological lore, and sacred motifs passed down through artisan lineages.",
          artworkCount: 28,
          image:
            "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=80",
          featured: true,
          order: 2,
        },
        {
          name: "Contemporary Indian Art",
          slug: "contemporary-art",
          shortDescription:
            "Modern interpretations of traditional motifs by distinguished regional artists.",
          description:
            "Modern interpretations of traditional motifs, reimagining architectural silhouettes and spiritual symbols through contemporary color palettes.",
          artworkCount: 24,
          image:
            "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80",
          featured: true,
          order: 3,
        },
        {
          name: "Sculptures & Bronze",
          slug: "sculptures",
          shortDescription:
            "Hand-cast lost-wax bell metal (Dhokra) and hand-carved Vindhya sandstone sculptures.",
          description:
            "Hand-cast lost-wax bell metal (Dhokra) and hand-carved Vindhya sandstone sculptures carrying timeless architectural resonance.",
          artworkCount: 19,
          image:
            "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
          featured: true,
          order: 4,
        },
        {
          name: "Handcrafted Creations",
          slug: "handcrafted-art",
          shortDescription:
            "Handmade heritage wood carvings, brass temple accents, and antique-finished decorative treasures.",
          description:
            "Handmade heritage teakwood carvings, brass temple accents, and antique-finished decorative treasures created in historic craft clusters.",
          artworkCount: 22,
          image:
            "https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=800&q=80",
          featured: true,
          order: 5,
        },
        {
          name: "Royal Textile & Zari Art",
          slug: "textiles",
          shortDescription:
            "Handwoven Chanderi silk wall tapestries and zari-embroidered devotional hangings (Pichwai).",
          description:
            "Handwoven Chanderi silk wall tapestries, zardozi gold-thread panels, and devotional hangings continuing Bundelkhand's royal textile lineage.",
          artworkCount: 16,
          image:
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
          featured: true,
          order: 6,
        },
      ]);
    }

    // 3. Seed Artworks
    const artworkCount = await Artwork.countDocuments();
    if (artworkCount === 0) {
      console.log("Seeding default Masterpiece Artworks...");
      await Artwork.create([
        {
          title: "Royal Durbar of Orchha: The Celestial Assembly",
          slug: "royal-durbar-of-orchha-fresco",
          artist: "Pt. Ramnarayan Sharma",
          artistSlug: "ramnarayan-sharma",
          category: "Traditional Paintings",
          categorySlug: "paintings",
          style: "Bundelkhand Royal Fresco",
          collectionName: "The Bundelkhand Heritage Collection",
          collectionSlug: "bundelkhand-heritage",
          description:
            "An authentic Bundeli court painting inspired by the 17th-century frescoes inside the Raja Mahal of Orchha, rendered with handmade cinnabar and powdered gold.",
          story:
            "In this monumental composition, the Bundela sovereign sits under an embroidered canopy surrounded by court musicians, royal envoys, and celestial apsaras.",
          price: 84500,
          originalPrice: 95000,
          isPriceOnRequest: false,
          images: [
            { url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85" },
            { url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85" },
          ],
          medium: "Natural Mineral Pigments & 24K Gold Leaf",
          material: "Handmade Sanganeri Wasli Paper",
          dimensions: "36 x 48 inches",
          orientation: "Landscape",
          size: "Large",
          availability: "In Stock",
          isNew: true,
          isFeatured: true,
          isLimitedEdition: true,
          sku: "BK-ORC-001",
          specs: {
            framed: "Museum-grade Teakwood Frame with Museum Acrylic",
            certificate: "Signed & Certified by Master Artist Pt. Sharma",
            signature: "Hand-signed and stamped on reverse",
            year: "2024",
            weight: "6.8 kg",
          },
        },
        {
          title: "Sanjhi: The Sacred Peacock of Chhatarpur",
          slug: "sanjhi-sacred-peacock-relief",
          artist: "Devaki Bai Prajapati",
          artistSlug: "devaki-bai-prajapati",
          category: "Folk Art & Murals",
          categorySlug: "folk-art",
          style: "Bundeli Sanjhi & Terracotta",
          collectionName: "Colours of Indian Folk Art",
          collectionSlug: "folk-art-traditions",
          description:
            "Intricate stenciled relief using Ken river silt clay, cow dung wash, and natural ochre pigments depicting the sacred peacock under a Kadamba tree.",
          story:
            "Sanjhi is the revered evening ritual art of Bundelkhand maidenhood. Created during the Pitru Paksha fortnight, these geometric and zoomorphic forms welcome cosmic blessings into the domestic courtyard.",
          price: 36000,
          originalPrice: 42000,
          isPriceOnRequest: false,
          images: [
            { url: "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1200&q=85" },
          ],
          medium: "Ken River Silt Clay, Natural Ochre & Rice Paste",
          material: "Seasoned Teakwood Panel Base",
          dimensions: "28 x 38 inches",
          orientation: "Portrait",
          size: "Medium",
          availability: "In Stock",
          isNew: true,
          isFeatured: true,
          isLimitedEdition: false,
          sku: "BK-CHT-002",
          specs: {
            framed: "Rustic Floating Teakwood Shadowbox",
            certificate: "Authenticity Dossier from Orchha Folk Guild",
            signature: "Thumb impression & seal on lower corner",
            year: "2024",
            weight: "5.2 kg",
          },
        },
        {
          title: "Gond Forest Reverie: The Tree of Life & River Ken",
          slug: "gond-forest-tree-of-life",
          artist: "Anand Singh Shyam",
          artistSlug: "anand-singh-shyam",
          category: "Folk Art & Murals",
          categorySlug: "folk-art",
          style: "Contemporary Gond Art",
          collectionName: "Colours of Indian Folk Art",
          collectionSlug: "folk-art-traditions",
          description:
            "A masterwork of micro-dot patterns and rhythm, narrating the ancient Gond myth where spirits of birds, deer, and river waters dwell inside a giant Mahua tree.",
          story:
            "In Gond philosophy, looking at a good artwork brings good fortune. The intricate line-and-dot fills ('dhanna' and 'bithu') create optical movement.",
          price: 52000,
          originalPrice: 58000,
          isPriceOnRequest: false,
          images: [
            { url: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=85" },
          ],
          medium: "Acrylic & Natural Pigment Emulsion",
          material: "Archival Belgian Cotton Canvas",
          dimensions: "40 x 50 inches",
          orientation: "Landscape",
          size: "Large",
          availability: "In Stock",
          isNew: false,
          isFeatured: true,
          isLimitedEdition: true,
          sku: "BK-GND-003",
          specs: {
            framed: "Unstretched Rolled Canvas in Velvet Tube (Framing Available)",
            certificate: "Tribal Lineage Certificate & Artist Video Provenance",
            signature: "Signed on face and reverse by Anand Singh Shyam",
            year: "2024",
            weight: "2.1 kg",
          },
        },
        {
          title: "Dhokra Lost-Wax Bell Metal: Royal Bundela War Horse",
          slug: "dhokra-bell-metal-bundela-horse",
          artist: "Ghanshyam Baghel",
          artistSlug: "ghanshyam-baghel",
          category: "Sculptures & Bronze",
          categorySlug: "sculptures",
          style: "Lost-Wax Bell Metal (Dhokra)",
          collectionName: "The Master Sculptor's Atelier",
          collectionSlug: "master-sculptors",
          description:
            "An imposing 4,000-year-old lost-wax cast bell metal bronze sculpture of the storied Bundela cavalry steed with ceremonial saddle and embossed bridle.",
          story:
            "Each Dhokra bronze sculpture is inherently unique; because the beeswax model melts away during casting, no duplicate can ever be poured.",
          price: 68000,
          originalPrice: 75000,
          isPriceOnRequest: false,
          images: [
            { url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=85" },
          ],
          medium: "Lost-Wax Bell Metal Bronze (Copper & Tin Alloy)",
          material: "Hand-cast Solid Bell Metal with Antique Patina",
          dimensions: "18 x 14 x 8 inches",
          orientation: "Square",
          size: "Medium",
          availability: "In Stock",
          isNew: true,
          isFeatured: true,
          isLimitedEdition: true,
          sku: "BK-DHK-004",
          specs: {
            framed: "Custom Hand-polished Rosewood Base Plinth",
            certificate: "National Master Craftsman Metal Heritage Seal",
            signature: "Artisan casting seal struck on base plinth",
            year: "2024",
            weight: "9.4 kg",
          },
        },
        {
          title: "Radha Krishna in the Nikunj of Vrindavan: Orchha Miniatures",
          slug: "radha-krishna-orchha-miniature",
          artist: "Pt. Ramnarayan Sharma",
          artistSlug: "ramnarayan-sharma",
          category: "Traditional Paintings",
          categorySlug: "paintings",
          style: "17th Century Bundeli Miniature",
          collectionName: "The Bundelkhand Heritage Collection",
          collectionSlug: "bundelkhand-heritage",
          description:
            "Devotional court miniature depicting the divine lovers amidst flowering creepers and deer, detailed using single-hair squirrel brushes and real 24K gold dust.",
          story:
            "The Rasikapriya poetic tradition was composed by the Bundeli court poet Keshavdas in Orchha. This miniature visualizes verse 12.",
          price: 92000,
          originalPrice: 105000,
          isPriceOnRequest: false,
          images: [
            { url: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1200&q=85" },
          ],
          medium: "Natural Mineral Pigments & 24K Gold Leaf",
          material: "Sun-cured Handmade Wasli Paper",
          dimensions: "24 x 32 inches",
          orientation: "Portrait",
          size: "Medium",
          availability: "In Stock",
          isNew: true,
          isFeatured: true,
          isLimitedEdition: true,
          sku: "BK-ORC-005",
          specs: {
            framed: "24K Gold Leaf Gilded Italian Wooden Molding",
            certificate: "Heritage Lineage Dossier & Archival Test Certificate",
            signature: "Master Artist Signature in Devanagari script",
            year: "2024",
            weight: "4.8 kg",
          },
        },
      ]);
    }

    // 4. Seed Cultural Achievements
    const achievementCount = await Achievement.countDocuments();
    if (achievementCount === 0) {
      console.log("Seeding default Achievements...");
      await Achievement.create([
        {
          type: "stat",
          number: "450+",
          label: "Certified Masterpieces",
          detail: "Archival artworks authenticated with physical signature certificates of lineage.",
          icon: "Award",
          order: 1,
          isActive: true,
        },
        {
          type: "stat",
          number: "85+",
          label: "Artisan Lineages Sustained",
          detail: "4th and 5th generation hereditary painter and sculptor families supported in Bundelkhand.",
          icon: "Users",
          order: 2,
          isActive: true,
        },
        {
          type: "stat",
          number: "18+",
          label: "Countries of Global Collectors",
          detail: "White-glove insured delivery to private collectors and galleries across 5 continents.",
          icon: "Globe",
          order: 3,
          isActive: true,
        },
        {
          type: "stat",
          number: "300+",
          label: "Years of Court Lineage",
          detail: "Reviving 17th-century Raja Mahal and Datia palace fresco traditions with mineral pigments.",
          icon: "Landmark",
          order: 4,
          isActive: true,
        },
        {
          type: "milestone",
          badge: "NATIONAL MASTER ARTISANS",
          title: "Presidential & National Honors",
          description:
            "Affiliated master artists have been conferred prestigious National Awards for reviving Orchha court frescoes and lost-wax Dhokra bronze casting.",
          icon: "Trophy",
          order: 5,
          isActive: true,
        },
        {
          type: "milestone",
          badge: "CULTURAL PRESERVATION ARCHIVE",
          title: "UNESCO & Heritage Archival Citations",
          description:
            "Recognized by national cultural boards for documenting lost formulas of Betwa river clay washes, verdigris copper pigments, and Sanganeri wasli preparation.",
          icon: "ShieldCheck",
          order: 6,
          isActive: true,
        },
        {
          type: "milestone",
          badge: "PRIVATE ESTATE COMMISSIONS",
          title: "Permanent Collections in Heritage Palaces",
          description:
            "Commissioned by leading royal families, luxury heritage hotels, and distinguished cultural institutions across India and Europe.",
          icon: "Scroll",
          order: 7,
          isActive: true,
        },
      ]);
    }

    // 5. Seed Celebrity Patrons
    const celebrityCount = await CelebrityPatron.countDocuments();
    if (celebrityCount === 0) {
      console.log("Seeding default Celebrity Patron Acquisitions...");
      await CelebrityPatron.create([
        {
          celebrityName: "Saif Ali Khan & Kareena Kapoor Khan",
          celebrityTitle: "Royal Patrons & Cinema Icons",
          location: "Pataudi Estate & Mumbai",
          artworkTitle: "Royal Durbar of Orchha: Celestial Assembly",
          artist: "Pt. Ramnarayan Sharma",
          medium: "Natural Mineral Pigments & 24K Gold Leaf on Handmade Wasli Paper",
          dimensions: "36 x 48 inches",
          year: "2024",
          image:
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85",
          quote:
            "The nuanced 17th-century Bundeli court portraiture and hand-ground cinnabar pigments hold a timeless architectural grace that anchors our ancestral gallery walls.",
          artworkSlug: "royal-durbar-of-orchha-fresco",
          tag: "Bespoke Royal Commission",
          order: 1,
        },
        {
          celebrityName: "Amitabh Bachchan",
          celebrityTitle: "Legendary Actor & Cultural Connoisseur",
          location: "Jalsa Residence, Mumbai",
          artworkTitle: "The Sacred Chhatris of Orchha at Sunset",
          artist: "Devaki Bai Prajapati",
          medium: "Ken River Silt Clay, Natural Ochre & 22K Gold Dust on Wasli",
          dimensions: "40 x 52 inches",
          year: "2023",
          image:
            "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1200&q=85",
          quote:
            "A monumental tribute to the spiritual resonance of the Betwa riverbank. The master artisans have preserved our country's ancient aesthetic soul with astonishing purity.",
          artworkSlug: "sanjhi-sacred-peacock-relief",
          tag: "Private Living Estate Acquisition",
          order: 2,
        },
        {
          celebrityName: "Shabana Azmi & Javed Akhtar",
          celebrityTitle: "Celebrated Literary & Cinematic Luminaries",
          location: "Khandala Heritage Retreat",
          artworkTitle: "Vindhyan Forest: The Golden Deer of Betwa",
          artist: "Kailash Chand Verma",
          medium: "Stone Pigments, Lapis Lazuli & Organic Gum on Archival Cotton Rag",
          dimensions: "32 x 44 inches",
          year: "2024",
          image:
            "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1200&q=85",
          quote:
            "Poetry in visual form. The lyrical harmony of the Vindhyan forest flora and delicate gold foil leaves has an enchanting stillness that inspires our daily creative life.",
          artworkSlug: "gond-forest-tree-of-life",
          tag: "Curated Estate Installation",
          order: 3,
        },
      ]);
    }

    // 6. Seed News
    const newsCount = await News.countDocuments();
    if (newsCount === 0) {
      console.log("Seeding default News & Press Dispatches...");
      await News.create([
        {
          title: "Bundeli Kalavrat Showcases 17th-Century Orchha Fresco Revivals at India Art Fair 2026",
          slug: "india-art-fair-2026-showcase",
          badge: "EXHIBITION & ART FAIR",
          outlet: "India Art Fair • New Delhi",
          date: "October 28, 2026",
          readTime: "3 min read",
          image:
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85",
          summary:
            "A landmark exhibition featuring 28 original wasli frescoes, drawing international museum curators, heritage architects, and private connoisseurs worldwide.",
          link: "/contact?subject=exhibition-inquiry",
          order: 1,
        },
        {
          title: "Master Painter Pt. Ramnarayan Sharma Honored with National Heritage Preservation Award",
          slug: "national-heritage-preservation-award-2026",
          badge: "GOVERNMENT CITATION",
          outlet: "National Crafts Council of India",
          date: "October 12, 2026",
          readTime: "4 min read",
          image:
            "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=85",
          summary:
            "Conferred in recognition of four decades dedicated to reviving natural mineral pigments, cinnabar preparation, and courtly Bundeli miniature techniques.",
          link: "/artists/ramnarayan-sharma",
          order: 2,
        },
        {
          title: "Architectural Digest Feature: Bundelkhand Folk Art & Gold Inlays in Luxury Contemporary Living",
          slug: "architectural-digest-feature-luxury-homes",
          badge: "PRESS & MEDIA",
          outlet: "Architectural Digest India",
          date: "September 15, 2026",
          readTime: "5 min read",
          image:
            "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1200&q=85",
          summary:
            "Leading interior designers from Mumbai, London, and Dubai share how certified Bundeli wall reliefs and wasli scrolls create soulful focal points in modern luxury residences.",
          link: "/journal",
          order: 3,
        },
      ]);
    }

    // 7. Seed Blogs
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      console.log("Seeding default Blogs & Journal Essays...");
      await Blog.create([
        {
          title: "Exploring the Artistic Heritage of Bundelkhand: Murals, Palaces & Forgotten Masters",
          slug: "exploring-the-artistic-heritage-of-bundelkhand",
          category: "Heritage & History",
          date: "October 14, 2026",
          readTime: "7 min read",
          author: "Dr. Vikramaditya Rathore",
          authorRole: "Historian & Cultural Archivist",
          coverImage:
            "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1200&q=85",
          summary:
            "From the dramatic ramparts of Orchha to the jewel-like chambers of Datia, Bundelkhand’s art traditions married warrior resilience with delicate poetic devotion.",
          content:
            "Between the Vindhya hills and the sacred Yamuna River stretches Bundelkhand—a land of dramatic granite boulder landscapes, majestic medieval forts, and an artistic legacy that has quietly shaped Indian aesthetic history for half a millennium.",
          published: true,
        },
        {
          title: "The Stories Behind Traditional Indian Art: Sacred Geometry, Folktales & Devotion",
          slug: "the-stories-behind-traditional-indian-art",
          category: "Artistic Traditions",
          date: "September 28, 2026",
          readTime: "6 min read",
          author: "Sunaina Bundela",
          authorRole: "Senior Curator",
          coverImage:
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85",
          summary:
            "Why traditional Indian art is rarely decorative for its own sake: understanding the spiritual grammar, cosmic symbolism, and sacred allegories.",
          content:
            "In Indian classical philosophy, art is not merely an object for visual admiration; it is a yantra—a sacred instrument of contemplation designed to attune the viewer's consciousness to cosmic harmony.",
          published: true,
        },
      ]);
    }

    // 8. Seed Reviews
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      console.log("Seeding default Patron Reviews...");
      await Review.create([
        {
          name: "Dr. Arvind Shrivastava",
          location: "New Delhi",
          role: "Art Collector & Historian",
          rating: 5,
          date: "October 24, 2026",
          comment:
            "The Orchha Darbar fresco commissioned for our private gallery is nothing short of breathtaking. The depth of the mineral lapis lazuli and genuine gold leaf gilding brings Bundelkhand's royal legacy alive. Truly museum-grade craftsmanship.",
          artworkTitle: "Orchha Darbar Gathering",
          verified: true,
          isApproved: true,
        },
        {
          name: "Meenakshi Sundaram",
          location: "Bangalore",
          role: "Interior Architect",
          rating: 5,
          date: "October 18, 2026",
          comment:
            "Collaborating with the Kalavrat master artists on WhatsApp for custom dimensions was completely seamless. They shared progress photographs of natural pigment grinding and wasli paper curing. Our clients were utterly spellbound.",
          artworkTitle: "Radha Krishna in Nikunj",
          verified: true,
          isApproved: true,
        },
        {
          name: "Vikramaditya Rathore",
          location: "Jaipur",
          role: "Heritage Resort Curator",
          rating: 5,
          date: "September 29, 2026",
          comment:
            "We commissioned three bespoke Bundeli hunting miniatures for our heritage suites. The micro-detailing of the single squirrel-hair brushstrokes and organic botanical pigments is authentic to 17th-century court style.",
          artworkTitle: "Royal Hunting Expedition",
          verified: true,
          isApproved: true,
        },
      ]);
    }

    console.log("Database seeded successfully with initial heritage catalog assets!");
  } catch (error) {
    console.error("Database seeding encountered an issue:", error?.message || error);
  }
};

export default seedDatabase;

