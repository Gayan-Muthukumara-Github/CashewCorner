import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerateHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        String password = "cashew@123";
        String hash = encoder.encode(password);
        
        System.out.println("Password: " + password);
        System.out.println("BCrypt Hash: " + hash);
        
        // Verify the hash works
        boolean matches = encoder.matches(password, hash);
        System.out.println("Hash verification: " + matches);
        
        // Test with existing hashes
        String existingHash1 = "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";
        String existingHash2 = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DRjk38";
        
        System.out.println("\nTesting existing hashes:");
        System.out.println("Hash1 matches 'hello': " + encoder.matches("hello", existingHash1));
        System.out.println("Hash1 matches 'cashew@123': " + encoder.matches("cashew@123", existingHash1));
        System.out.println("Hash2 matches 'user123': " + encoder.matches("user123", existingHash2));
        System.out.println("Hash2 matches 'cashew@123': " + encoder.matches("cashew@123", existingHash2));
    }
}
