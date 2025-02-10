
import pygame
import sys

# Initialize pygame
pygame.init()

# Set the window size
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))

# Set the title
pygame.display.set_caption("2D Racing Game")

# Define colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GREEN = (0, 255, 0)
RED = (255, 0, 0)

# Car settings
CAR_WIDTH = 50
CAR_HEIGHT = 100
car_x = SCREEN_WIDTH // 2 - CAR_WIDTH // 2
car_y = SCREEN_HEIGHT - CAR_HEIGHT - 10
car_speed = 5

# Load car image (use your own image if you prefer)
car_image = pygame.Surface((CAR_WIDTH, CAR_HEIGHT))
car_image.fill(RED)

# Main game loop
def game_loop():
    global car_x, car_y

    clock = pygame.time.Clock()

    # Game loop flag
    game_running = True

    while game_running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                game_running = False

        # Get key presses for movement
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT] and car_x > 0:
            car_x -= car_speed
        if keys[pygame.K_RIGHT] and car_x < SCREEN_WIDTH - CAR_WIDTH:
            car_x += car_speed

        # Fill the screen with a background color
        screen.fill(GREEN)

        # Draw the car
        screen.blit(car_image, (car_x, car_y))

        # Update the display
        pygame.display.update()

        # Set the frame rate
        clock.tick(60)

    # Quit pygame when the loop ends
    pygame.quit()
    sys.exit()

# Start the game loop
game_loop()
