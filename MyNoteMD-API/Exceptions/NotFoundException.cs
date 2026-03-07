using System.Net;

namespace MyNoteMD_API.Exceptions
{
    public class NotFoundException : AppException
    {
        public NotFoundException(string message) : base(message, HttpStatusCode.NotFound) { }
    }
}
