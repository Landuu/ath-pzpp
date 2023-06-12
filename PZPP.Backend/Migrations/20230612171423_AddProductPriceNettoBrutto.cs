using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PZPP.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddProductPriceNettoBrutto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Price",
                table: "Products",
                newName: "PriceNetto");

            migrationBuilder.AddColumn<decimal>(
                name: "PriceBrutto",
                table: "Products",
                type: "decimal(10,2)",
                precision: 10,
                scale: 2,
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PriceBrutto",
                table: "Products");

            migrationBuilder.RenameColumn(
                name: "PriceNetto",
                table: "Products",
                newName: "Price");
        }
    }
}
