using System.Net;

namespace MyNoteMD_API.Exceptions
{
    public class InternalServerException : AppException
    {
        public string TechnicalMessage { get; }

        public InternalServerException(
            string technicalMessage,
            string safeClientMessage = "A server-related problem occurred while processing your request. Please try again later.")
            : base(safeClientMessage, HttpStatusCode.InternalServerError)
        {
            TechnicalMessage = technicalMessage;
        }
    }
}
