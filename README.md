# MyNoteMD

MyNoteMD, kullanıcıların genişletilmiş Markdown formatında notlar kaydedebilmesi ve bu notları koleksiyonlar oluşturarak organize edebilmesi için geliştirilmiş zengin özellikli bir Markdown not yönetim sistemidir. 

## 🛠 Backend Tech Stack

*   **Runtime:** .NET 10
*   **Veritabanı:** PostgreSQL (Entity Framework Core)
*   **Oturum Yönetimi:** Redis (Opaque Tokens)
*   **Güvenlik:** Identity Core, HttpOnly Cookies, Antiforgery Tokens (CSRF Protection)
*   **Loglama:** Serilog
*   **API Tasarım ve Dokümantasyon:** OpenAPI
*   **ID Yapısı:** UUIDv7

## 🛠 Frontend Tech Stack
- **Framework:** [React.js](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Form Management:** [React Hook Form](https://react-hook-form.com/)
- **Schema Validation:** [Yup](https://github.com/jquense/yup)
- **Icons:** [Lucide React](https://lucide.dev/)
- **HTTP Client:** [Axios](https://axios-http.com/)

## ✨ Temel Özellikler

### 🔐 Oturum Yönetimi ve Oturum Güvenliği
-   **Opaque Token & Redis:** Ana oturum yönetimi için **Opaque** tokenlar kullanılır. Tüm oturumlar Redis üzerinde yönetilir, bu sayede anında oturum sonlandırma mümkündür.
-   **HttpOnly Cookies:** Tokenlar `localStorage` yerine JavaScript erişimine kapalı `HttpOnly, Secure, SameSite=Strict` çerezlerde tutulur. Bu, **XSS** saldırılarına karşı koruma sağlar.
-   **CSRF Koruması:** Çerez tabanlı kimlik doğrulamanın getirdiği risklere karşı **Antiforgery Token**lar kullanılmaktadır.
-   **Audit Logging:** Çeşitli işlemler veritabanında kayıt altına alınır.

### 🚀 Veri Yönetimi
-   **Cursor-Based Pagination:** Veritabanı performansı ve işlem hızı için Base64 şifreli cursor-based pagination sistemi kullanılır.
-   **Soft Delete & Cascading Trash:** Silinen her şey önce çöp kutusuna gider. Bir koleksiyon silindiğinde içindeki tüm notlar otomatik olarak çöpe taşınır ve geri yükleme (Restore) sırasında silme zamanlamaları göz önünde bulundurularak kullanıcı deneyiminin artırılması hedeflenir.

>[!Note]
>Frontend için detaylı açıklama `client/MyNoteMD-Web/README.md` dosyasında mevcuttur.

---

*Bu proje fullstack web geliştirme pratiği için tech stack'de belirtilen teknolojilerin öğrenilmesi ve bir proje üzerinde uygulanması amacıyla geliştirilmiştir.*
