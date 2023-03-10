using AutoMapper;
using PZPP.Backend.Dto.Auth;
using PZPP.Backend.Models;

namespace PZPP.Backend.MappingProfiles
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<User, UserContextDto>()
                .ForMember(dest => dest.UID, x => x.MapFrom(src => src.Id))
                .ForMember(dest => dest.Name, x => x.MapFrom(src => src.FirstName + " " + src.LastName));
        }
    }
}
