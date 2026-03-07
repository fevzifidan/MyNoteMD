using System.Net;

namespace MyNoteMD_API.Exceptions
{
    public class BadRequestException : AppException
    {
        public BadRequestException(string message) : base(message, HttpStatusCode.BadRequest) { }
    }
}
