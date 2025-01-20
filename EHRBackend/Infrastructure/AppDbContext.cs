using Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
        public DbSet<User> Users { get; set; }
        public DbSet<State> States { get; set; }
        public DbSet<City> City { get; set; }
        public DbSet<Roles> Roles { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Qualification> Qualifications { get; set; }
        public DbSet<Specialization> Specializations { get; set; }
        public DbSet<BloodGroup> BloodGroups { get; set; }
        public DbSet<Otp> Otp { get; set; }
        public DbSet<Gender> Genders { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<SOAPNotes> SOAPNotes { get; set; }

    }
}
