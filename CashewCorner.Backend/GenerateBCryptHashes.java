import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerateBCryptHashes {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
        
        String adminPassword = "admin123";
        String techAdminPassword = "cashew@123";
        
        String adminHash = encoder.encode(adminPassword);
        String techAdminHash = encoder.encode(techAdminPassword);
        
        System.out.println("Admin password hash for 'admin123': " + adminHash);
        System.out.println("Tech admin password hash for 'cashew@123': " + techAdminHash);
        
        // Verify the hashes work
        System.out.println("Admin hash verification: " + encoder.matches(adminPassword, adminHash));
        System.out.println("Tech admin hash verification: " + encoder.matches(techAdminPassword, techAdminHash));
    }
}
