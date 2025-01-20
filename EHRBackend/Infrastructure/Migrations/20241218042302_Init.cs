using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Appointments",
                columns: table => new
                {
                    appointmentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    providerId = table.Column<int>(type: "int", nullable: false),
                    patientId = table.Column<int>(type: "int", nullable: false),
                    appointmentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    appointmentTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    chiefComplaint = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    appointmentStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    fee = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointments", x => x.appointmentId);
                });

            migrationBuilder.CreateTable(
                name: "BloodGroups",
                columns: table => new
                {
                    bloodGroupId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    bloodGroupName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BloodGroups", x => x.bloodGroupId);
                });

            migrationBuilder.CreateTable(
                name: "City",
                columns: table => new
                {
                    cityId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    cityName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    stateId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_City", x => x.cityId);
                });

            migrationBuilder.CreateTable(
                name: "Countries",
                columns: table => new
                {
                    countryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    countryName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Countries", x => x.countryId);
                });

            migrationBuilder.CreateTable(
                name: "Genders",
                columns: table => new
                {
                    genderId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    genderName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Genders", x => x.genderId);
                });

            migrationBuilder.CreateTable(
                name: "Qualifications",
                columns: table => new
                {
                    qualificationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    qualificationName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Qualifications", x => x.qualificationId);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    roleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    roleName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.roleId);
                });

            migrationBuilder.CreateTable(
                name: "Specializations",
                columns: table => new
                {
                    specializationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    specializationName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Specializations", x => x.specializationId);
                });

            migrationBuilder.CreateTable(
                name: "States",
                columns: table => new
                {
                    stateId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    stateName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    countryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_States", x => x.stateId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    userId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    firstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    lastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    dob = table.Column<DateTime>(type: "datetime2", nullable: false),
                    username = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    password = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    mobile = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    genderId = table.Column<int>(type: "int", nullable: false),
                    roleId = table.Column<int>(type: "int", nullable: false),
                    bloodGroupId = table.Column<int>(type: "int", nullable: false),
                    address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    pincode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    city = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    countryId = table.Column<int>(type: "int", nullable: false),
                    stateId = table.Column<int>(type: "int", nullable: false),
                    profileImage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    qualificationId = table.Column<int>(type: "int", nullable: true),
                    specializationId = table.Column<int>(type: "int", nullable: true),
                    registrationNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    visitingCharge = table.Column<float>(type: "real", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.userId);
                    table.ForeignKey(
                        name: "FK_Users_BloodGroups_bloodGroupId",
                        column: x => x.bloodGroupId,
                        principalTable: "BloodGroups",
                        principalColumn: "bloodGroupId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Users_Countries_countryId",
                        column: x => x.countryId,
                        principalTable: "Countries",
                        principalColumn: "countryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Users_Genders_genderId",
                        column: x => x.genderId,
                        principalTable: "Genders",
                        principalColumn: "genderId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Users_Qualifications_qualificationId",
                        column: x => x.qualificationId,
                        principalTable: "Qualifications",
                        principalColumn: "qualificationId");
                    table.ForeignKey(
                        name: "FK_Users_Roles_roleId",
                        column: x => x.roleId,
                        principalTable: "Roles",
                        principalColumn: "roleId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Users_Specializations_specializationId",
                        column: x => x.specializationId,
                        principalTable: "Specializations",
                        principalColumn: "specializationId");
                    table.ForeignKey(
                        name: "FK_Users_States_stateId",
                        column: x => x.stateId,
                        principalTable: "States",
                        principalColumn: "stateId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Otp",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userId = table.Column<int>(type: "int", nullable: false),
                    otp = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Otp", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Otp_Users_userId",
                        column: x => x.userId,
                        principalTable: "Users",
                        principalColumn: "userId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Otp_userId",
                table: "Otp",
                column: "userId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_bloodGroupId",
                table: "Users",
                column: "bloodGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_countryId",
                table: "Users",
                column: "countryId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_genderId",
                table: "Users",
                column: "genderId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_qualificationId",
                table: "Users",
                column: "qualificationId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_roleId",
                table: "Users",
                column: "roleId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_specializationId",
                table: "Users",
                column: "specializationId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_stateId",
                table: "Users",
                column: "stateId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Appointments");

            migrationBuilder.DropTable(
                name: "City");

            migrationBuilder.DropTable(
                name: "Otp");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "BloodGroups");

            migrationBuilder.DropTable(
                name: "Countries");

            migrationBuilder.DropTable(
                name: "Genders");

            migrationBuilder.DropTable(
                name: "Qualifications");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Specializations");

            migrationBuilder.DropTable(
                name: "States");
        }
    }
}
