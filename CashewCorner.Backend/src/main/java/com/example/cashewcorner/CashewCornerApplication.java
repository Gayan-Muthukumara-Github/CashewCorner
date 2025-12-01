package com.example.cashewcorner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class CashewCornerApplication {

  public static void main(String[] args) {

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
    System.out.println(encoder.encode("cashew@123"));
    SpringApplication.run(CashewCornerApplication.class,
      args);
  }

}
