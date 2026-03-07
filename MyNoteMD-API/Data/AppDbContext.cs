using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MyNoteMD_API.Models;
using System.Runtime.InteropServices;

namespace MyNoteMD_API.Data
{
    public class AppDbContext: IdentityDbContext<AppUser, IdentityRole<Guid>, Guid>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Note> Notes { get; set; }
        public DbSet<Collection> Collections { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // 1. Global Query Filters
            builder.Entity<Note>().HasQueryFilter(n => n.DeletedAt == null);
            builder.Entity<Collection>().HasQueryFilter(c => c.DeletedAt == null);
            builder.Entity<Tag>().HasQueryFilter(t => t.DeletedAt == null);

            // 2. Indexes
            builder.Entity<Note>().HasIndex(n => n.Slug).IsUnique();

            builder.Entity<Note>().HasIndex(n => new { n.OwnerId, n.CreatedAt });
            builder.Entity<Collection>().HasIndex(c => c.OwnerId);

            builder.Entity<Note>()
                .HasOne(n => n.Collection)
                .WithMany(c => c.Notes)
                .HasForeignKey(n => n.CollectionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Note>()
                .HasOne(n => n.Owner)
                .WithMany(u => u.Notes)
                .HasForeignKey(n => n.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Collection>()
                .HasOne(c => c.Owner)
                .WithMany(u => u.Collections)
                .HasForeignKey(c => c.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Tag>()
                .HasOne(t => t.Owner)
                .WithMany(u => u.Tags)
                .HasForeignKey(t => t.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries<BaseEntity>();

            foreach (var entry in entries)
            {
                if(entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedAt = DateTimeOffset.UtcNow;
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedAt = DateTimeOffset.UtcNow;
                    entry.Property(e => e.CreatedAt).IsModified = false;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
