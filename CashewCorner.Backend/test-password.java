import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestPassword {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Generate new hashes
        String adminHash = encoder.encode("admin123");
        String userHash = encoder.encode("user123");
        String managerHash = encoder.encode("manager123");
        
        System.out.println("Admin hash: " + adminHash);
        System.out.println("User hash: " + userHash);
        System.out.println("Manager hash: " + managerHash);
        
        // Test existing hash
        String existingHash = "$2a$10$slYQmyNdGzin7olVN3p5Be7DkH0/LHQbZeOp3Jmj2O5gsUlwiMgCm";
        boolean matches = encoder.matches("admin123", existingHash);
        System.out.println("Existing hash matches admin123: " + matches);
    }
}
