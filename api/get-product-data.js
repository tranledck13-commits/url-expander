export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ hỗ trợ POST' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL không hợp lệ' });
  }

  try {
    // Gọi API AddLiveTag để lấy thông tin sản phẩm
    const apiUrl = `https://data.addlivetag.com/product-data/product-data.php?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: 'Không thể lấy thông tin sản phẩm',
      });
    }

    const data = await response.json();

    // Kiểm tra dữ liệu
    if (data.productName && data.imageUrl && data.itemId) {
      return res.status(200).json({
        success: true,
        data: {
          productName: data.productName,
          imageUrl: data.imageUrl,
          itemId: data.itemId,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Không tìm thấy thông tin sản phẩm',
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Lỗi khi lấy thông tin sản phẩm',
    });
  }
};
