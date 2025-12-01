import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestPassword {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
        
        // Test the existing hash from data.sql
        String existingHash = "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";
        System.out.println("Testing 'hello' against existing hash: " + encoder.matches("hello", existingHash));
        System.out.println("Testing 'admin123' against existing hash: " + encoder.matches("admin123", existingHash));
        
        // Generate new hash for 'hello'
        String newHashForHello = encoder.encode("hello");
        System.out.println("New hash for 'hello': " + newHashForHello);
        System.out.println("Testing 'hello' against new hash: " + encoder.matches("hello", newHashForHello));
        
        // Generate hash for 'admin123'
        String hashForAdmin123 = encoder.encode("admin123");
        System.out.println("Hash for 'admin123': " + hashForAdmin123);
        System.out.println("Testing 'admin123' against its hash: " + encoder.matches("admin123", hashForAdmin123));
    }
}
