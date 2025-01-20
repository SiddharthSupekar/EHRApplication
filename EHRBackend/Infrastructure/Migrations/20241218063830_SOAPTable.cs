using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SOAPTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SOAPNotes",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    appointmentId = table.Column<int>(type: "int", nullable: false),
                    subjective = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    objective = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    assessment = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    plan = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SOAPNotes", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SOAPNotes");
        }
    }
}
