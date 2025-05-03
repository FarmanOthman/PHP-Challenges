<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create an admin user
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ]);

        // Create regular users
        $users = User::factory(5)->create();

        // Create posts for each user
        $users->each(function ($user) use ($users) {
            // Create published posts
            $posts = Post::factory(rand(3, 5))
                ->published()
                ->create([
                    'user_id' => $user->id,
                ]);
            
            // Create draft posts
            Post::factory(rand(1, 2))
                ->draft()
                ->create([
                    'user_id' => $user->id,
                ]);
            
            // Create comments for each published post
            $posts->each(function ($post) use ($users) {
                // Create 1-5 comments for each post
                Comment::factory(rand(1, 5))
                    ->approved()
                    ->create([
                        'post_id' => $post->id,
                        'user_id' => $users->random()->id,
                    ]);
                
                // Occasionally create an unapproved comment
                if (rand(0, 10) > 7) {
                    Comment::factory()
                        ->unapproved()
                        ->create([
                            'post_id' => $post->id,
                            'user_id' => $users->random()->id,
                        ]);
                }
            });
        });
    }
}
