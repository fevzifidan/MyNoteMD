using System.Net;

namespace MyNoteMD_API.Exceptions
{
    public class UnauthorizedException: AppException
    {
        public UnauthorizedException(string message): base(message, HttpStatusCode.Unauthorized) { }
    }
}
