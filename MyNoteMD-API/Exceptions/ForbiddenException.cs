using System.Net;

namespace MyNoteMD_API.Exceptions
{
    public class ForbiddenException: AppException
    {
        public ForbiddenException(string message): base(message, HttpStatusCode.Forbidden) { }
    }
}
