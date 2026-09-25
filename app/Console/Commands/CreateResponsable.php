<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class CreateResponsable extends Command
{
    protected $signature = 'app:create-responsable
                            {email : Login e-mail of the responsable}
                            {--name= : Display name (defaults to the part before @)}
                            {--password= : Password (prompted when omitted; avoid passing it on shared shells)}';

    protected $description = 'Create a responsable (coordinator) account. Self-registration only ever creates délégués.';

    public function handle(): int
    {
        $email = strtolower($this->argument('email'));
        $name = $this->option('name') ?: strstr($email, '@', true);
        $password = $this->option('password') ?? $this->secret('Password (min. 8 characters)');

        $validator = Validator::make(
            ['email' => $email, 'name' => $name, 'password' => $password],
            [
                'email' => ['required', 'email', 'max:255', 'unique:users,email'],
                'name' => ['required', 'string', 'max:255'],
                'password' => ['required', Password::defaults()],
            ],
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'responsable',
        ]);
        $user->forceFill(['email_verified_at' => now()])->save();

        $this->info("Responsable {$user->email} created.");

        return self::SUCCESS;
    }
}
