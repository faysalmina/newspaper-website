<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ads', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // শুধু অ্যাডমিন প্যানেলে চেনার জন্য, ইউজার দেখবে না
            $table->enum('ad_type', ['image', 'video'])->default('image');
            $table->string('image')->nullable();
            $table->string('video_url')->nullable(); // YouTube বা direct video link
            $table->string('target_url')->nullable(); // ক্লিক করলে কোথায় যাবে

            // পজিশন — daily-bangladesh এর মতো জায়গাগুলো
            $table->enum('position', ['header', 'sidebar', 'in_article', 'homepage_top', 'footer']);

            $table->integer('width')->nullable();  // শুধু তথ্যের জন্য (যেমন 300)
            $table->integer('height')->nullable(); // শুধু তথ্যের জন্য (যেমন 250)

            $table->boolean('is_active')->default(true);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();

            $table->unsignedBigInteger('impressions_count')->default(0);
            $table->unsignedBigInteger('clicks_count')->default(0);
            $table->integer('order')->default(0);

            $table->timestamps();

            $table->index(['position', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ads');
    }
};