using System.Text;

namespace MyNoteMD_API.Utils
{
    public static class CursorHelper
    {
        // Cursor Format: "UtcTicks_Guid"

        public static string Encode(DateTimeOffset createdAt, Guid id)
        {
            var plainText = $"{createdAt.UtcTicks}_{id}";
            var plainTextBytes = Encoding.UTF8.GetBytes(plainText);

            // Convert to Base64
            return Convert.ToBase64String(plainTextBytes);
        }

        public static (DateTimeOffset CreatedAt, Guid Id)? Decode(string? cursor)
        {
            if (string.IsNullOrWhiteSpace(cursor)) return null;

            try
            {
                var base64EncodedBytes = Convert.FromBase64String(cursor);
                var plainText = Encoding.UTF8.GetString(base64EncodedBytes);

                var parts = plainText.Split('_');
                if (parts.Length != 2) return null;

                if (long.TryParse(parts[0], out long ticks) && Guid.TryParse(parts[1], out Guid id))
                {
                    return (new DateTimeOffset(ticks, TimeSpan.Zero), id);
                }

                return null;
            }
            catch
            {
                // Return null if an invalid or manipulated base64 is received
                return null;
            }
        }
    }
}
