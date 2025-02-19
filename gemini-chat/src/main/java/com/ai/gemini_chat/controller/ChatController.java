package com.ai.gemini_chat.controller;

import com.ai.gemini_chat.service.QnaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/qna")
@RequiredArgsConstructor
public class ChatController {

    private final QnaService qnaService;

    @PostMapping("/ask")
    public ResponseEntity<String> askQuestion(@RequestBody Map<String,String> payload){
         String question= payload.get("question");
         String answer=qnaService.getAnswer(question);
         return ResponseEntity.ok(answer);
    }
}
