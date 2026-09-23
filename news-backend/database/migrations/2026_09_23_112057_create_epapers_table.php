<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('epapers', function (Blueprint $table) {
            $table->id();
            $table->date('publish_date')->unique(); // একই তারিখের একটাই সংস্করণ থাকবে
            $table->string('title')->nullable();     // না দিলে তারিখ থেকেই বানানো হবে
            $table->string('pdf_file');
            $table->string('cover_image')->nullable(); // থাম্বনেইল, না দিলে ডিফল্ট আইকন দেখাবে
            $table->foreignId('uploaded_by')->constrained('users')->cascadeOnDelete();
            $table->unsignedBigInteger('downloads_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('epapers');
    }
};