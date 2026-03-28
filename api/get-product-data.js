export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ hỗ trợ POST' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL không hợp lệ' });
  }

  try {
    // Gọi API AddLiveTag
    const apiUrl = `https://data.addlivetag.com/product-data/product-data.php?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    const data = await response.json();

    // Kiểm tra dữ liệu từ AddLiveTag
    if (data.status === 'success' && data.productInfo) {
      const info = data.productInfo;
      return res.status(200).json({
        success: true,
        data: {
          productName: info.productName || 'N/A',
          imageUrl: info.imageUrl || '',
          itemId: info.itemId || '',
          price: info.price || 0,
          sales: info.sales || 0,
          rating: info.rating || '0',
          shopName: info.shopName || 'N/A',
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        error: data.message || 'Không tìm thấy thông tin sản phẩm',
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Lỗi khi lấy thông tin sản phẩm',
    });
  }
};
